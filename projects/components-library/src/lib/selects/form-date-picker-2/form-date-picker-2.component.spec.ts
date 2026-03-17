import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatePicker2Component } from './form-date-picker-2.component';

describe('FormDatePicker2Component', () => {
  let component: FormDatePicker2Component;
  let fixture: ComponentFixture<FormDatePicker2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDatePicker2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDatePicker2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
