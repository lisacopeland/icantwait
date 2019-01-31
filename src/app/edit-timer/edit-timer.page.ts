import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TimerService } from 'src/app/shared/services/timer.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AlertController, ToastController } from '@ionic/angular';
import { User } from 'firebase';
import { UserInterfaceWithId } from 'src/app/shared/interfaces/user.interface';
import { TimerInterfaceWithId, TimerInterface } from 'src/app/shared/interfaces/timer.interface';
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-timer',
  templateUrl: './edit-timer.page.html',
  styleUrls: ['./edit-timer.page.scss'],
})
export class EditTimerPage implements OnInit {

  timerId: string;
  currentUser: UserInterfaceWithId;
  timerForm: FormGroup;
  timer: TimerInterfaceWithId;
  editMode = false;
  processing = false;
  editTitle = 'Create a New Timer';
  unitChoices = ['hours', 'days', 'weeks', 'months', 'years'];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private timerService: TimerService,
    private userService: UserService,
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    console.log('currentUser is ' + this.currentUser);
    this.initForm();
    this.route.params.subscribe((params) => {
      this.timerId = params['id'];
      if (this.timerId) {
        this.editMode = true;
        this.editTitle = 'Edit an existing timer';
        this.getTimer();
      }
    });
  }

  initForm() {
    const defaultDate = new Date().toISOString();

    this.timerForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      endedMessage: [''],
      location: [''],
      startDate: [defaultDate, Validators.required],
      endDate: [defaultDate, Validators.required],
      endTime: ['08:00'],
      units: ['days'],
      endAtZero: [true],
      backGroundUrl: ['']
    });
  }

  patchForm(timer: TimerInterface) {
    this.timerForm.patchValue({
      name: timer.name,
      description: timer.description,
      endedMessage: timer.endedMessage,
      location: timer.location,
      startDate: timer.startDate.toDate(),
      endDate: timer.endDate.toDate(),
      endTime: timer.endTime.toDate(),
      units: timer.units,
      endAtZero: timer.endAtZero,
      backGroundUrl: timer.backGroundUrl
    });
  }

  getTimer() {
    this.timerService.getTimer(this.timerId)
      .subscribe(docSnapShot => {
        this.timer = docSnapShot.data() as TimerInterfaceWithId;
        this.patchForm(this.timer);
      });
  }

  onSubmit() {
    this.processing = true;
    const formValues = this.timerForm.value;
    const startDate = new Date(formValues.startDate).getTime();
    const endDate = new Date(formValues.endDate).getTime();
    const endTime = new Date(formValues.endTime).getTime();
    const newTimer: TimerInterface = {
      userId: this.currentUser.id,
      name: formValues.name,
      description: formValues.description,
      endedMessage: formValues.endedMessage,
      location: formValues.location,
      startDate: firebase.firestore.Timestamp.fromMillis(startDate),
      endDate: firebase.firestore.Timestamp.fromMillis(endDate),
      endTime: firebase.firestore.Timestamp.fromMillis(endTime),
      units: formValues.units,
      endAtZero: formValues.endAtZero,
      backGroundUrl: formValues.backGroundUrl
    };
    if (this.editMode) {
      this.timerService.updateTimer(newTimer, this.timerId)
        .subscribe(() => {
          this.processing = false;
          this.presentToast();
        }, error => {
          this.processing = false;
          console.log('error updating timer' + error);
        });
    } else {
      this.timerService.addTimer(newTimer)
        .subscribe(() => {
          this.processing = false;
          this.presentToast();
        }, error => {
          this.processing = false;
          console.log('error adding timer' + error);
        });
    }
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Your timer has been saved.',
      duration: 2000
    });
    toast.present()
      .then(() => {
        this.router.navigate(['/home']);
      });
  }
}
