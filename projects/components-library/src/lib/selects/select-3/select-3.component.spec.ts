import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Select3Component } from './select-3.component';

describe('Select3Component', () => {
  let component: Select3Component;
  let fixture: ComponentFixture<Select3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Select3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Select3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
