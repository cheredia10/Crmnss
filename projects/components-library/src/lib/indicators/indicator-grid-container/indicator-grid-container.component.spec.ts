import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGridContainerComponent } from './indicator-grid-container.component';

describe('IndicatorGridContainerComponent', () => {
  let component: IndicatorGridContainerComponent;
  let fixture: ComponentFixture<IndicatorGridContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorGridContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorGridContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
