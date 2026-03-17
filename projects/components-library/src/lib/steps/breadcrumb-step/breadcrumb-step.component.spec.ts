import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbStepComponent } from './breadcrumb-step.component';

describe('BreadcrumbStepComponent', () => {
  let component: BreadcrumbStepComponent;
  let fixture: ComponentFixture<BreadcrumbStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
