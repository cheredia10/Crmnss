import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Select1Component } from './select-1.component';

describe('Select1Component', () => {
  let component: Select1Component;
  let fixture: ComponentFixture<Select1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Select1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Select1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
