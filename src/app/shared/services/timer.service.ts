import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, Subject } from 'rxjs';
import { TimerInterfaceWithId, TimerInterface } from '../interfaces/timer.interface';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TimerService {

    constructor(private firestoreService: AngularFirestore) {}

    getTimersByUser(userId): Observable<TimerInterfaceWithId[]> {
      console.log('UserId is ' + userId);
        return this.firestoreService.collection('timers',
        ref => ref.where('userId', '==', userId))
          .snapshotChanges()
          .pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as TimerInterface;
              console.log('got a timer - it is ' + data);
              const id = a.payload.doc.id;
              return {id, ...data} as TimerInterfaceWithId;
            }))
          );
      }

      getTimer(id: string) {
        return this.firestoreService.collection('timers').doc(id).get();
      }

      addTimer(timer: TimerInterface) {
        return this.fromFirebasePromise(this.firestoreService.collection('timers').add(timer));
      }

      updateTimer(timer: TimerInterface, id: string) {
        return this.fromFirebasePromise(this.firestoreService.collection('timers').doc(id).update(timer));
      }

      deleteTimer(timer: TimerInterfaceWithId) {
        return this.fromFirebasePromise(this.firestoreService.collection('timers').doc(timer.id).delete());
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
