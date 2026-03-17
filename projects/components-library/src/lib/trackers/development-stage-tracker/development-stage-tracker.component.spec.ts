import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentStageTrackerComponent } from './development-stage-tracker.component';

describe('DevelopmentStageTrackerComponent', () => {
  let component: DevelopmentStageTrackerComponent;
  let fixture: ComponentFixture<DevelopmentStageTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentStageTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevelopmentStageTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
