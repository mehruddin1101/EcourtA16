// navbar.component.ts

import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  items: any;
  userDetail: any;
  private authenticationSubscription: Subscription;

  constructor(private router: Router, private token: JwtService) {
    this.userDetail = this.token.decodeJwtToken();
    this.updateNavbarItems();

    this.authenticationSubscription = this.token.getAuthenticationStatus().subscribe((authenticated) => {
      this.userDetail = this.token.decodeJwtToken();
      console.log(this.userDetail)
      this.updateNavbarItems();
    });
  }

  private updateNavbarItems(): void {
    const isAuthenticated = this.token.isAuthenticated();
    const userRoles = this.userDetail ? this.userDetail.roles : [];


    if (!isAuthenticated) {
      this.items = [
        { label: 'Ecourt App', icon: 'pi pi-fw pi-home' },
        { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: 'login' },
        { label: 'Register', icon: 'pi pi-fw pi-user-plus', routerLink: 'register' },
      ];
    } else {
      // Handle multiple roles if needed
      if (userRoles[0].authority.includes('ADMIN')) {
        this.items = [
          { label: 'Ecourt App', icon: 'pi pi-fw pi-home' },
          { label: 'Case History', icon: 'pi pi-fw pi-list', routerLink: 'case-history' },
          { label: 'Message Status', icon: 'pi pi-fw pi-list', routerLink: 'message-status' },
          { label: 'Transactions', icon: 'pi pi-fw pi-list', routerLink: 'transactions' },
          { label: 'Complaints', icon: 'pi pi-fw pi-list', routerLink: 'complaints-list' },
          { label: 'Feedbacks', icon: 'pi pi-fw pi-list', routerLink: 'feedback-list' },
          { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logOut() },
        ];
      } else if (userRoles[0].authority.includes('USER')) {
        this.items = [
          { label: 'Ecourt App', icon: 'pi pi-fw pi-home' },
          { label: 'Profile Modify', icon: 'pi pi-fw pi-pencil', routerLink: 'profile-modify' },
          { label: 'Case Page', icon: 'pi pi-fw pi-list', routerLink: 'case-page' },
          { label: 'Mobile Maintenance', icon: 'pi pi-fw pi-cog', routerLink: 'mobile-management' },
          { label: 'Package Selection', icon: 'pi pi-fw pi-shopping-cart', routerLink: 'package-selection' },
          { label: 'Transactions', icon: 'pi pi-fw pi-list', routerLink: 'transactions' },
          { label: 'Case History', icon: 'pi pi-fw pi-chart-bar', routerLink: 'case-history' },
          { label: 'Complaints', icon: 'pi pi-fw pi-list', routerLink: 'customer-complaints' },
          { label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => this.logOut() },
        ];
      }
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logOut(): void {
    this.token.logout();
    this.router.navigate(['/login'], {
      replaceUrl: true,
      skipLocationChange: true,
      state: {}
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.authenticationSubscription) {
      this.authenticationSubscription.unsubscribe();
    }
  }
}
