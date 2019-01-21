import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  error: string;
  signupForm: FormGroup;

    constructor(private alertCtrl: AlertController,
                private formBuilder: FormBuilder,
                private router: Router,
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
