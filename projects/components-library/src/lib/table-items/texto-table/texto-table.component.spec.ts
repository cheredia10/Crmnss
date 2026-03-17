import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoTableComponent } from './texto-table.component';

describe('TextoTableComponent', () => {
  let component: TextoTableComponent;
  let fixture: ComponentFixture<TextoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextoTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
