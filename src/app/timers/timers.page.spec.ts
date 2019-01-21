import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimersPage } from './timers.page';

describe('TimersPage', () => {
  let component: TimersPage;
  let fixture: ComponentFixture<TimersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
