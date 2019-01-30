import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { TimerService } from '../shared/services/timer.service';
import { UserInterfaceWithId } from '../shared/interfaces/user.interface';
import { TimerInterfaceWithId } from '../shared/interfaces/timer.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  currentUser: UserInterfaceWithId;
  timers: Observable<TimerInterfaceWithId[]>;
  now = Date.now();

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

  timeUntil(endDate: firebase.firestore.Timestamp) {
    return endDate.toMillis() - this.now;
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
