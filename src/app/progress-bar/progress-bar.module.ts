import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ProgressBarComponent } from './progress-bar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ProgressBarComponent]
})
export class ProgressBarModule {
}
