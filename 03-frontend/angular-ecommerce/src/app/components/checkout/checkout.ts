import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form-service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { Cart } from '../../services/cart';
import { CheckoutService } from '../../services/checkout-service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { Purchase } from '../../common/purchase';
import { OrderItem } from '../../common/order-item';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private shopFormService: ShopFormService,
    private cartService: Cart,
    private checkoutService: CheckoutService,
    private router: Router) {

  }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,5}$'), ShopValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10), ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(10), ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$'), Validators.maxLength(16)]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$'), Validators.maxLength(3)]),
        // expirationMonth: new FormControl('', [Validators.required]),
        // expirationYear: new FormControl('', [Validators.required])
      })
    });
    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth)
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonths = data;
      }
    );
    // popoulate credit card years
    const startYear: number = new Date().getFullYear();
    console.log("startYear: " + startYear);
    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieve credit card years: " + JSON.stringify(data))
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }
  reviewCartDetails() {
    // subscribe to cart service total.Quantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity)

    // subscribe to the cart service total.Price
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get cardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  // get cardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  // get cardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }


  copyShippingAddressToBillingAddress(event: Event) {
    if ((event.target as HTMLInputElement).checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix code for states
      this.billingAddressStates = this.shippingAddressStates;

    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // reset billing address states, bug fix
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log("Handle the submit button!");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      console.log("Checkout form is invalid");
      return;
    }

    //setup order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;
    console.log("Items in the cart: " + JSON.stringify(cartItems));
    //--long way
    // let orderItems: OrderItem[] = [];
    // for (let i = 0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }
    //--short way
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    console.log("Order items: " + JSON.stringify(orderItems));

    //setup purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    console.log("Purchase customer: " + JSON.stringify(purchase.customer));

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase - order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via the checkout service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
        // reset cart
        this.resetCart();
        // navigate to the order confirmation page
        this.router.navigateByUrl('/order-confirmation');
      },
      error: err => {
        alert(`There was an error while placing your order: ${err.message}`);
      }
    });

    // console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is: " + this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The shipping address country is: " + JSON.stringify(this.checkoutFormGroup.get('shippingAddress')?.value.country.name));
    console.log("The shipping address state is: " + JSON.stringify(this.checkoutFormGroup.get('shippingAddress')?.value.state.name));
    console.log("The billing address country is: " + JSON.stringify(this.checkoutFormGroup.get('billingAddress')?.value.country.name));
    console.log("The billing address state is: " + JSON.stringify(this.checkoutFormGroup.get('billingAddress')?.value.state.name));
    console.log("The credit card is: " + JSON.stringify(this.checkoutFormGroup.get('creditCard')?.value.cardType.name));

  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the selected year is the same as the current year, then start with the current month
    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1; // +1 because months are 0-based
    } else {
      startMonth = 1; // January
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    if (!formGroup) {
      console.error(`Form group ${formGroupName} not found`);
      return;
    }
    console.log(formGroup.value); // See what fields are present
    console.log(formGroup.value.country); // Check if country exists
    const countryCode = formGroup.value.country.code;
    console.log(`${formGroupName} country code:  ${countryCode}`);

    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country name:  ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        console.log(`Retrieved states for ${countryName}: ` + JSON.stringify(data));
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select the first item by default
        formGroup.get('state')?.setValue(data[0]);
      }
    );
  }

}

