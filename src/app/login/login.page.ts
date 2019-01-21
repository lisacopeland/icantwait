import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  processing = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private toastCtrl: ToastController,
              private authService: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    this.authService.authenticateUser(this.loginForm.value.email, this.loginForm.value.password)
    .subscribe((data) => {
        // ToDo: RH:  Refactor to Pipe / Map?
        localStorage.setItem('userId', data.uid);
        this.router.navigate(['/home']);
    }, error1 => {
        this.processing = false;
        this.presentErrorToast(error1.error.message);
    });
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastCtrl.create({
        message: error,
        duration: 3000
    });
    toast.present();
  }
}
