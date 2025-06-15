import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { LoginService } from '../commons/services/LoginService';
import { User } from '../commons/dto/User';
import { UserToken } from '../commons/dto/UserToken';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { error } from 'console';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../commons/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  })

  userDummy : User={
    username:"pablito",
    password:"pablocoba"
  }

  user : User ={
    username:"",
    password:""
  };

  userToken !: UserToken;

  constructor(
    private loginService: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router : Router
  ){
    
  }

  ngOnInit(): void {
    
  }

  onLogin(){

    this.user.username = this.loginForm.get('username')?.value;
    this.user.password = this.loginForm.get('password')?.value;

    if (isPlatformBrowser(this.platformId)) {

      //inicia la llamada y recoge el token.
      this.loginService.userLogIn(this.user).subscribe(
        (user: UserToken) => {

          if (user && user.token) {
            //asigna el token, el username y el proyecto seleccionado al localStorage. 
            localStorage.setItem('authToken', user.token);
            localStorage.setItem('username', user.username);
            localStorage.setItem('proyectoSeleccionado', '1');
            this.onLoginSuccess(user.token);
          } else {
            console.warn('El objeto de usuario o la propiedad token es nula/indefinida.');
          }
        },
        error => {

          console.error('Error en el login:', error);
        }
      );
    }
  }

  onLoginSuccess(token: string): void {
    this.authService.login(token);
    this.router.navigate(['/user']); // Redirige a la página user
  }
}
