import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";


export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    kind: string,
    registered?: boolean,
    displayName?: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
    readonly url = {
        signup: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAvD9SCGrtG-bad1T0cPsZOLu0tjKZcsPY',
        login: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAvD9SCGrtG-bad1T0cPsZOLu0tjKZcsPY'
    };

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.url.signup,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
            ).pipe(catchError(this.handleError), tap( resData => {
                this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
            }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.url.login,
                {
                    email: email,
                    password: password,
                    returnSecureToken: true
                }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);

    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirartionDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirartionDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes);
        let errorMessage = 'An unkonwn error occcurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!'; break;
            case'EMAIL_NOT_FOUND':
                errorMessage = 'This email is not found'; break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid password'; break;
            case 'USER_DISABLED':
                errorMessage = 'User is disabled'; break;
        }
        return throwError(errorMessage);
    }
}