import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInterface, UserInterfaceWithId } from '../interfaces/user.interface';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private firestoreService: AngularFirestore) {}

    private currentUser: UserInterface;

    getUser(id: string) {
        return this.firestoreService.collection('users').doc(id).get();
    }

    addUser(user: UserInterfaceWithId) {
        // Passing userId because I want the user record to have the same
        // id as the auth record
        return this.fromFirebasePromise(this.firestoreService.collection('users').doc(user.id).set(user));
    }

    updateUser(user: UserInterface, uId: string) {
        return this.fromFirebasePromise(this.firestoreService.collection('users').doc(uId).update(user));
    }

    setCurrentUser(user: UserInterface) {
        this.currentUser = user;

    }

    getCurrentUser() {
        return this.currentUser;
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
