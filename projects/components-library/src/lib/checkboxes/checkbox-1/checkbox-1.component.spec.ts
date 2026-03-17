import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkbox1Component } from './checkbox-1.component';

describe('Checkbox1Component', () => {
  let component: Checkbox1Component;
  let fixture: ComponentFixture<Checkbox1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkbox1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
