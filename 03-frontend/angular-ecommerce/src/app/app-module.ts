import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ProductList } from './components/product-list/product-list';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenu } from './components/product-category-menu/product-category-menu';
import { ProductCategory } from './common/product-category';
import { Search } from './components/search/search';
import { ProductDetails } from './components/product-details/product-details';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatus } from './components/cart-status/cart-status';
import { CartDetails } from './components/cart-details/cart-details';
import { Checkout } from './components/checkout/checkout';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatus } from './components/login-status/login-status';
import myAppConfig from './config/my-app-config';
import { AuthInterceptorService } from './services/auth-interceptor-service';
import { Login } from './components/login/login';
import { AuthGuard, AuthHttpInterceptor, AuthModule, AuthService } from '@auth0/auth0-angular';
import { MembersPage } from './components/members-page/members-page';
import { OrderHistory } from './common/order-history';
import { OrderHistoryComponent } from './components/order-history-component/order-history-component';
import { CommonModule } from '@angular/common';




const routes: Routes = [
  // { path: 'login/callback', component: AuthInterceptorService },
  // { path: 'login', component: Login },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  { path: 'members', component: MembersPage, canActivate: [AuthGuard]},
  { path: 'checkout', component: Checkout },
  { path: 'cart-details', component: CartDetails },
  { path: 'products/:id', component: ProductDetails },
  { path: 'search/:keyword', component: ProductList },
  { path: 'category/:id/:name', component: ProductList },
  { path: 'category', component: ProductList },
  { path: 'products', component: ProductList },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
]

// Removed manual instantiation of AuthService, as it should be injected by Angular

@NgModule({
  declarations: [
    App,
    ProductList,
    ProductDetails,
    ProductCategoryMenu,
    Checkout,
    CartStatus,
    CartDetails,
    Search,
    LoginStatus,
    Login,
    MembersPage,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    CommonModule,
    AuthModule.forRoot({
      ...myAppConfig.auth,
      // cacheLocation: 'localstorage',
      httpInterceptor: {
        ...myAppConfig.httpInterceptor,
      },
    })
   ],
  providers: [ProductService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true, },],
  bootstrap: [App]
})
export class AppModule { }
