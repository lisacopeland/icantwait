import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { UserInterfaceWithId } from '../shared/interfaces/user.interface';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase';

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
              private facebook: Facebook,
              private userService: UserService,
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
    this.processing = true;
    this.authService.authenticateUser(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(
        mergeMap(userData => {
          localStorage.setItem('userId', userData.user.uid);
          return this.userService.getUser(userData.user.uid)
            .pipe(
                map(user => {
                  const currentUser = user.data() as UserInterfaceWithId;
                  currentUser.id = user.id;
                  this.userService.setCurrentUser(currentUser);
                  this.processing = false;
                  this.router.navigate(['/home']);
                })
            );
        }))
        .subscribe(data => {},
          error => {
            this.processing = false;
            console.log('error logging in user with error ' + error);
            this.presentErrorToast(error.message);
          });

  }

  onFacebook(): Promise<any> {
    return this.facebook.login(['email'])
      .then(response => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then(success => {
            console.log('Firebase success: ' + JSON.stringify(success));
          });
      }).catch((error) => { console.log(error); });
  }

  async presentErrorToast(error: string) {
    const toast = await this.toastCtrl.create({
        message: error,
        duration: 3000
    });
    toast.present();
  }
}
