import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  error: string;
  signupForm: FormGroup;
  processing = false;

    constructor(private alertCtrl: AlertController,
                private formBuilder: FormBuilder,
                private router: Router,
                private userService: UserService,
                private authService: AuthService) {
    }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.processing = true;
    this.authService.registerUser(this.signupForm.value.email, this.signupForm.value.password)
      .subscribe((userCredential: firebase.auth.UserCredential) => {
        console.log('registered user, user is ' + JSON.stringify(userCredential));
        const newUser = {
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          email: this.signupForm.value.email,
          avatarUrl: '',
          address: {
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: '',
            country: ''
          },
          status: 'active',
          id: userCredential.user.uid
        };
        console.log('going to add the user');
        this.userService.addUser(newUser)
          .subscribe((data) => {
            console.log('successfully created user!');
            this.processing = false;
            this.router.navigate(['/home']);
          },
          error => {
            this.processing = false;
            console.log('error creating user record');
          });
      }, error => {
        console.log('error registering user', error);
        this.processing = false;
        this.presentErrorAlert()
          .then(() => {
            this.router.navigate(['/login']);
          });
      });
  }

  async presentErrorAlert() {

    const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Your account could not be created.',
        message: 'Please contact customer service!',
        buttons: ['OK']
    });
    return await alert.present();
  }
}
