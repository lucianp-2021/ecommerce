import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-history-component',
  standalone: false,
  templateUrl: './order-history-component.html',
  styleUrl: './order-history-component.css'
})

export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;


  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {

    this.handleOrderHistory();
  }

  handleOrderHistory() {
    // Retrieve the user email from session storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail') || '{}');
    console.log('Retrieved user email:', theEmail);

    // retreieve data from the order history service
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
        console.log('Order history retrieved:', this.orderHistoryList);
      },
      error => {
        console.error('Error retrieving order history:', error);
      }
    );
  }

}
