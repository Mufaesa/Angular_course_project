import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  apiKey: string = 'AIzaSyDj6PIB2MOoADwJBcRz3QYYyCu4RG5OIv8';
  signUpUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
    this.apiKey;
  logInUrl: string =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
    this.apiKey;

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.signUpUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  signIn(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.logInUrl, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    // Create new user instance with correct expiration timer, set autoLogout timer, provide user to our current user and save user in localstorage
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
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

  autoLogin() {
    // Create new variable with user prerequisites instance based on localStorage data
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    // Create new user instance based on localStorage data
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    // Provide user to our current user and set the autoLogout timer
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    // set user to null, remove from browser data, redirect and remove autoLogout timer
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['./auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number) {
    // Log user out automatically after 1 hour
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
