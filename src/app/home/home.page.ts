import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { TimerService } from '../shared/services/timer.service';
import { UserInterfaceWithId } from '../shared/interfaces/user.interface';
import { TimerInterfaceWithId } from '../shared/interfaces/timer.interface';
import { Observable } from 'rxjs';

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
    private timerService: TimerService) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
  }

  getTimers() {
    this.timers = this.timerService.getTimersByUser(this.currentUser.id);
  }

  timeUntil(endDate: firebase.firestore.Timestamp) {
    return endDate.toMillis() - this.now;
  }

  onEdit() {
    
  }

  onAdd() {
    console.log('going to add a timer');
    this.router.navigateByUrl(this.router.url + '/add-timer/');

  }
}
