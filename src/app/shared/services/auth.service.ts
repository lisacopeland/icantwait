import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable, Subject} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment} from '../../../environments/environment';

/**
 * Service for Registering, logging in, and logging out users
 *
 * @export
 * @class AuthService
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
  currentUser = '';

    /**
     * Creates an instance of AuthService.
     * @param {HttpClient} http
     * @memberof AuthService
     */
    constructor(private http: HttpClient,
                private fbAuth: AngularFireAuth) {
    }

    registerUser(email, password) {
/*         const myHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        const body = JSON.stringify(authUser);
        const registerUrl = environment.apiUrl + '/register';
        return this.http.post<AuthUserResponse>(registerUrl, body, { headers: myHeaders })
            .pipe(map(data => {
                    localStorage.setItem('userId', data.uid);
                    localStorage.setItem('token', data.customToken);
                    console.log('data from API call is ' + data);
                    // this.sigininWithCustomToken(data.customToken);
                    return data;
                })
            );
 */     return this.fromFirebasePromise(this.fbAuth.auth.createUserWithEmailAndPassword(email, password));
    }

    /**
     * Given a user's email object and password, make an http call to authenticate the
     * user. Then, given the custom token returned from the http call, log the user in
     * to the firebase auth and get the claims for this user
     *
     * @param {string} userName
     * @param {string} password
     * @returns
     * @memberof AuthService
     */
    authenticateUser(email: string, password: string) {
        // Given a username and password, authenticate and set the current user
        return this.fromFirebasePromise(this.fbAuth.auth.signInWithEmailAndPassword(email, password));
    }

    sendPasswordReset(email: string) {
        return this.fbAuth.auth.sendPasswordResetEmail(email);
    }

    /**
     * Consumers make this call to see if there is a currently logged in user.
     * This is also used by the authGuard to guard routes
     *
     * @returns true if user is logged in, false if not
     * @memberof AuthService
     */
    isAuthenticated(): boolean {
        console.log('checking for authentication - ');
        console.log('current user is ' + this.fbAuth.auth.currentUser);
        return (this.fbAuth.auth.currentUser) ? true : false;
    }

    /**
     * Signs out the current firebase user
     *
     * @memberof AuthService
     */
    signOut() {
        this.fbAuth.auth.signOut()
            .then(() => {
                localStorage.removeItem('userId');
                localStorage.removeItem('token');
            });
    }

    private fromFirebasePromise(promise): Observable<any> {

        const subject = new Subject<any>();

        promise
            .then(res => {
                    subject.next(res);
                    subject.complete();
                },
                err => {
                    subject.error(err);
                    subject.complete();
                }
            );
        return subject.asObservable();
    }
}
