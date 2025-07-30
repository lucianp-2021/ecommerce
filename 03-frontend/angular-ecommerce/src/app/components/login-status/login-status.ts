import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login-status',
  standalone: false,
  templateUrl: './login-status.html',
  styleUrl: './login-status.css'
})
export class LoginStatus implements OnInit {

  isAuthenticated: boolean = false;
  profileJson: string | undefined;
  userEmail: string | undefined;
  storage: Storage = sessionStorage;
  userFullName: string = '';

  constructor(
    private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document) {
  }

  ngOnInit(): void {
    // Subscribe to authentication status and user data 
    this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
      this.getUserDetails();
      console.log('User is authenticated: ', this.isAuthenticated);
    });

    this.auth.user$.subscribe((user) => {
      this.userEmail = user?.email;
      this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
      console.log('User email: ', this.userEmail);
    });
  }

  // Method to get user details
  getUserDetails() {
    if (this.isAuthenticated) {
      // Fetch user details from Auth0
      //user full name is exposed as a property of the user object
      this.auth.user$.subscribe(user => {
        if (user) {
          this.userFullName = user.name || '';
          console.log('User details method return:', this.userFullName);
        } else {
          this.userFullName = '';
        }
      }
      );
    }
  }

  login() {
    this.auth.loginWithRedirect();
  }

  // Method to log out
  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }




}