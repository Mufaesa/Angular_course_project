import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) {}

    apiKey: string = "AIzaSyDj6PIB2MOoADwJBcRz3QYYyCu4RG5OIv8";
    signUpUrl: string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + this.apiKey;
    logInUrl: string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + this.apiKey;
    
    signUp(email: string, password: string){
        return this.http.post<AuthResponseData>(
            this.signUpUrl,
            {
                email: email,
                password: password,
                returnSecureToke: true
            }
        )
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn
                );
            })
        );
    }

    signIn(email: string, password: string){
        return this.http.post<AuthResponseData>(
            this.logInUrl,
            {
                email: email,
                password: password,
                returnSecureToke: true
            }
        )
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn
                );
            })
        );
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email, 
            userId, 
            token, 
            expirationDate
        );
            this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error occured!';
        if (!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email already exists.';
              break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'The email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'The password is not correct.';
                break;
          }
        return throwError(errorMessage);
    }
}
