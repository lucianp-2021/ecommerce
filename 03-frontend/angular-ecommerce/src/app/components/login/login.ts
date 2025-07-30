import { Component, Inject, OnInit } from '@angular/core';
import myAppConfig from '../../config/my-app-config';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  authSignIn: any;

  constructor(@Inject(AuthService) private auth: AuthService) {
    logo: 'assets/images/logo.png';
    // Initialize Auth0 client with configuration from myAppConfig
    this.authSignIn = new Auth0Client({
      domain: myAppConfig.auth.domain,
      clientId: myAppConfig.auth.clientId,
      authorizationParams: {
        pkce: true,
        issuer: myAppConfig.auth.authorizationParams,
        redirect_uri: myAppConfig.auth.authorizationParams.redirect_uri
      }
    });
  }
  ngOnInit(): void {

    this.authSignIn.remove();

    this.authSignIn.renderElement({
      el: document.getElementById('#login-container') // this name should be the same with the one from login.html
    }, 
    (response: any) => {
      if(response === 'SUCCESS') {
        this.auth.loginWithRedirect()
        console.log('Login successful');
      }
      console.log('Login successful:', response);
    }, 
    (error: any) => {
      throw new Error('Login failed');
      console.error('Login failed:', error);
    });
  }
}


