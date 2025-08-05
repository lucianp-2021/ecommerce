import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { Cart } from '../../services/cart';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-cart-details',
  standalone: false,
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css'
})
export class CartDetails implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  isAuthenticated: boolean = false;
  isDisabled: boolean = false

  constructor(private cartService: Cart, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.listCartDetails();
    this.getUserStatus();
  }

  getUserStatus(): void {
    this.authService.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
      if (!this.isAuthenticated) {
        this.isDisabled = true;
        alert("You must be logged in to checkout!");
        console.log('User is not authenticated, checkout not allowed!');
      } else {
        this.isDisabled = false;
        console.log('User is authenticated, checkout allowed!');
      }
    });
  }


  listCartDetails() {
    //get a handle to the cart item
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart toalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart totalPrice and total Quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);

  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }

}
