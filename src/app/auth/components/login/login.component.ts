import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserCredentials } from '../../models/user-credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading!: boolean;

  message!: {message : string, label: string, color: string, icon: string};

  loginForm!: FormGroup;
  loginValid = true;

  @ViewChild('password') pwd!: ElementRef;
  togglePwd = false;

  constructor(private authService : AuthService,
              private fb: FormBuilder,
              private router: Router,
              private ngZone: NgZone)
    { 
    }

  ngOnInit(): void {
    this.initForm();
  }

  private logInUser(user: UserCredentials): void {
    this.loading = true;
    this.authService.logon(user)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          if (data.access) {
            this.ngZone.run(() => this.router.navigate(['/anemometer/']));
          }
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 400) {
            const message =  error.error.non_field_errors[0];
            this.message = {
              message, label: '',
              color: 'red', icon: 'error'
            };
          } else {
            throw error;
          }
        }
      }
    );
   }

  showPassword() {
    this.pwd.nativeElement.type = 'text';
    this.togglePwd = ! this.togglePwd;
  }

  hidePassword() {
    this.pwd.nativeElement.type = 'password';
    this.togglePwd = ! this.togglePwd;
  }

   closeAlert(){
    this.message = {message: '', label: '', color: '', icon: ''};
   }

  onLogin() {
    if(!this.loginForm.valid){
      return;
    }
    this.logInUser({username: this.loginForm.value['username'], password:this.loginForm.value['password']})
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    }
    else{
      return 'Ce champ contient une erreur'
    }
  }

  private initForm(){
    this.loginForm = this.fb.group({
      username : [null, [Validators.required]],
      password : [null, [Validators.required, Validators.minLength(5)]]
    })
  }

}
