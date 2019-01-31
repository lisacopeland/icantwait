import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { TimerService } from '../shared/services/timer.service';
import { UserInterfaceWithId } from '../shared/interfaces/user.interface';
import { TimerInterfaceWithId } from '../shared/interfaces/timer.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  currentUser: UserInterfaceWithId;
  timers: Observable<TimerInterfaceWithId[]>;
  now = moment();

  constructor(private router: Router,
    private alertCtrl: AlertController,
    private userService: UserService,
    private authService: AuthService,
    private timerService: TimerService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = this.userService.getCurrentUser();
        if (!this.currentUser) {
          const userId = localStorage.getItem('userId');
          this.userService.getUser(userId)
          .subscribe(dbUser => {
              this.currentUser = dbUser.data() as UserInterfaceWithId;
              this.currentUser.id = dbUser.id;
              this.userService.setCurrentUser(this.currentUser);
              this.getTimers();
          });
        } else {
          this.getTimers();
        }
      } else {
        this.router.navigate(['/login']);
      }
    });

  }

  getTimers() {
    this.timers = this.timerService.getTimersByUser(this.currentUser.id);
  }

  timeUntil(timer: TimerInterfaceWithId) {

    // Make sure startDate is not in the future
    let startDate = moment(timer.startDate.toDate());
    if (startDate.isBefore(this.now)) {
      startDate = moment(this.now);
    }
    const endDate = moment(timer.endDate.toDate());
    let returnString = 'There is only ';
    if (timer.units === 'days') {
      returnString += endDate.diff(startDate, 'days') + ' days ';
    } else if (timer.units === 'weeks') {
      returnString += endDate.diff(startDate, 'weeks') + ' weeks ';
    } else if (timer.units === 'hours') {
      returnString += endDate.diff(startDate, 'hours') + ' hours ';
    } else if (timer.units === 'months') {
      returnString += endDate.diff(startDate, 'months') + ' months ' ;
    } else if (timer.units === 'years') {
      returnString += endDate.diff(startDate, 'years')  + ' years ';
    }
    returnString += 'until ' + timer.name;
    return returnString;
  }

  async onDelete(timer) {
     {
      const alert = await this.alertCtrl.create({
        header: 'Delete Timer',
        message: 'Are you sure you want to delete ' + timer.name,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
              this.timerService.deleteTimer(timer)
                .subscribe(data => {
                  // Dont do nuthin
                },
                error => {
                  console.log('Error deleting timer ' + error);
                });
            }
          }
        ]
      });
      await alert.present();
    }
  }
}
