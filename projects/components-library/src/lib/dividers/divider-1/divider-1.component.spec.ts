import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Divider1Component } from './divider-1.component';

describe('Divider1Component', () => {
  let component: Divider1Component;
  let fixture: ComponentFixture<Divider1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Divider1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Divider1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
