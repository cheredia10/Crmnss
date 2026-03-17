import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button2Component } from './button-2.component';

describe('Button2Component', () => {
  let component: Button2Component;
  let fixture: ComponentFixture<Button2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Button2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
