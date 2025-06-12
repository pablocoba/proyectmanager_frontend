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

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CommonModule
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
    console.log(this.loginForm.get('username')?.value)
    console.log(this.loginForm.get('password')?.value)

    this.user.username = this.loginForm.get('username')?.value;
    this.user.password = this.loginForm.get('password')?.value;

    if (isPlatformBrowser(this.platformId)) {

      this.loginService.userLogIn(this.user).subscribe(
        (user: UserToken) => {
          // No hay problema con console.log en el navegador
          console.log("user:",user);

          if (user && user.token) {
            localStorage.setItem('authToken', user.token);
            localStorage.setItem('username', user.username);
            console.log('Token guardado en localStorage:', user.token);
            this.onLoginSuccess(user.token);
          } else {
            // Asegúrate de que este console.warn también esté dentro del if (isPlatformBrowser)
            console.warn('El objeto de usuario o la propiedad token es nula/indefinida.');
          }
        },
        error => {
          // ¡Aquí es donde ocurre el error! Asegúrate de que console.error esté dentro del if
          console.error('Error en el login:', error);
        }
      );
    } else {
      // Si estás en un entorno no-navegador, puedes usar un logger que no dependa de console
      // o simplemente evitar el log en el cliente si no es necesario.
      // Si necesitas logs en el servidor, usarías un logger de Node.js o simplemente console.log/error
      // que funcionaría en el servidor.
      // console.warn('Ejecutando en entorno no-navegador, algunas funcionalidades de navegador no disponibles.');
    }

  }

  onLoginSuccess(token: string): void {
    this.authService.login(token);
    this.router.navigate(['/user']); // Redirige a la página user
  }
}
