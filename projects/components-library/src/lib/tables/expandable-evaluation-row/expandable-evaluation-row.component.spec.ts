import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableEvaluationRowComponent } from './expandable-evaluation-row.component';

describe('ExpandableEvaluationRowComponent', () => {
  let component: ExpandableEvaluationRowComponent;
  let fixture: ComponentFixture<ExpandableEvaluationRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableEvaluationRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableEvaluationRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
