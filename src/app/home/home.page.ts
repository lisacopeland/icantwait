import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { TimerService } from '../shared/services/timer.service';
import { UserInterfaceWithId } from '../shared/interfaces/user.interface';
import { TimerInterfaceWithId } from '../shared/interfaces/timer.interface';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

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
    if (this.authService.isAuthenticated()) {
      this.currentUser = this.userService.getCurrentUser();
      if (!this.currentUser) {
        const userId = localStorage.getItem('userId');
        this.userService.getUser(userId)
          .subscribe(user => {
              this.currentUser = user.data() as UserInterfaceWithId;
              this.currentUser.id = user.id;
              this.userService.setCurrentUser(this.currentUser);
          });
      }
    }

  }

  getTimers() {
    this.timers = this.timerService.getTimersByUser(this.currentUser.id);
  }

  timeUntil(endDate: firebase.firestore.Timestamp) {
    return endDate.toMillis() - this.now;
  }

}
