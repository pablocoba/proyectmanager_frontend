import { Injectable } from "@angular/core";
import { User } from "../dto/User";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserToken } from "../dto/UserToken";

@Injectable({
    providedIn: 'root'
})

export class LoginService {

    private baseUrl : string = 'https://tfc-t00f.onrender.com';
    private miembrosUrl : string = '/login';

    constructor(private http: HttpClient){}

    userLogIn(dto : User): Observable<UserToken>{
        return this.http.post<UserToken>(`${this.baseUrl}${this.miembrosUrl}`, dto)
    }

}