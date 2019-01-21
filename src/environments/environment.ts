// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBCsSHliOeU2ftuGAlw_46SfPZi1qtSuJs',
    authDomain: 'icantwait-4bd10.firebaseapp.com',
    databaseURL: 'https://icantwait-4bd10.firebaseio.com',
    projectId: 'icantwait-4bd10',
    storageBucket: '',
    messagingSenderId: '720034464327'
  },
  apiUrl: 'http://localhost:5000/icantwait-4bd10/us-central1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
