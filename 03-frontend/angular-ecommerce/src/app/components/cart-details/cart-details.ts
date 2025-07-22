import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { Cart } from '../../services/cart';

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

  constructor(private carteService: Cart) {

  }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
    //get a handle to the cart item
    this.cartItems = this.carteService.cartItems;

    //subscribe to the cart totalPrice
    this.carteService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart toalQuantity
    this.carteService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart totalPrice and total Quantity
    this.carteService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem){
    this.carteService.addToCart(theCartItem);

  }

  decrementQuantity(theCartItem: CartItem){
    this.carteService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem){
    this.carteService.remove(theCartItem);
  }

}
