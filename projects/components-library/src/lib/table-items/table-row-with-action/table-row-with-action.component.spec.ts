import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowWithActionComponent } from './table-row-with-action.component';

describe('TableRowWithActionComponent', () => {
  let component: TableRowWithActionComponent;
  let fixture: ComponentFixture<TableRowWithActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableRowWithActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableRowWithActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
