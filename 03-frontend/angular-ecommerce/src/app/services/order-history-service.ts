import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.shopApiUrl + '/orders';
  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
    // Construct the URL with the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    console.log('Order history URL:', orderHistoryUrl);
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

}
export interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}