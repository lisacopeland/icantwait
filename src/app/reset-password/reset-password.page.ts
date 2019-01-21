import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) { }


  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
      });
  }

  onSubmit() {
    this.authService.sendPasswordReset(this.resetPasswordForm.value.email)
    .then(() => {
      this.presentConfirmToast()
      .then(() => {
        this.router.navigate(['/login']);
      });

    })
    .catch(error => {
    });
  }

  async presentConfirmToast() {
    const toast = await this.toastCtrl.create({
        message: 'Check your email for a link to reset your password.',
        duration: 3000
    });
    toast.present();
  }
}
