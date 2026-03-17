import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Indicator1Component } from './indicator-1.component';

describe('Indicator1Component', () => {
  let component: Indicator1Component;
  let fixture: ComponentFixture<Indicator1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Indicator1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Indicator1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
