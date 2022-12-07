import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInUser } from 'src/app/auth/models/user-credentials.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user!: LoggedInUser|null;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(x => {this.user = x})
   }

  ngOnInit(): void {
  }

  logout(){
    this.authService.logout()
  }
}
