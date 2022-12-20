import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/models/user-credentials.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user?: User;

  constructor(private router: Router, public authService: AuthService, private ngZone: NgZone) {
  }
  
  ngOnInit(): void {
    this.authService.userActivate$.subscribe((user) => this.user = user);
  }

  getUser() {
   return `${this.authService.getUser().first_name} ${this.authService.getUser().last_name}`.trim();
  }

  go(url: string, logout = false) {
    if (logout) {
      this.authService.logout();
    }
    this.ngZone.run(() => this.router.navigate([url]));
  }
}
