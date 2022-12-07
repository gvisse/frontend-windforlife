import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserCredentials } from '../../models/user-credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginValid = true;

  private readonly returnUrl: string;

  constructor(private authService : AuthService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router)
    { 
      this.returnUrl = this.route.snapshot.queryParams['returnUrl']
    }

  ngOnInit(): void {
    this.initForm();
  }

  logInUser(user: UserCredentials): void {
    this.authService.login({username: user.username, password:user.password}).subscribe();
   }

  onLogin() {
    if(!this.loginForm.valid){
      return;
    }
    this.logInUser({username: this.loginForm.value['username'], password:this.loginForm.value['password']})
    this.router.navigateByUrl('/anemometer');
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    }
    else{
      return 'Ce champs contient une erreur'
    }
  }

  private initForm(){
    this.loginForm = this.fb.group({
      username : [null, [Validators.required]],
      password : [null, [Validators.required, Validators.minLength(5)]]
    })
  }

}
