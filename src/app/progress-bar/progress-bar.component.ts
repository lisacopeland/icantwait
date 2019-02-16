import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() value = 0;      // Number of units until goal
  @Input() total = 0;      // total units

  percentOfTotal = '0';
  tenthUnit = 0;
  // marks = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
  marks = [];
  constructor() { }

  ngOnInit() {
    console.log('progress bar - value is ' + this.value + ' total is ' + this.total);
    let percentNumber = (this.value / this.total) * 100;
    if (percentNumber > 100) {
      percentNumber = 100;
    }
    console.log('after math, % is ' + percentNumber);
    const percentDone = 100 - percentNumber;
    this.percentOfTotal = percentDone.toString();
    console.log('percentoftotal is ' + this.percentOfTotal);
    this.tenthUnit = Math.floor(this.total / 10);
    this.marks.push('0');
    for (let i = 1; i < 11; i++) {
      this.marks.push(Math.floor(this.tenthUnit * i).toString());
    }
  }

}
