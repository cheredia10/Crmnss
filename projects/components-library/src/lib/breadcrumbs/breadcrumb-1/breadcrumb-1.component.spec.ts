import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Breadcrumb1Component } from './breadcrumb-1.component';

describe('Breadcrumb1Component', () => {
  let component: Breadcrumb1Component;
  let fixture: ComponentFixture<Breadcrumb1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Breadcrumb1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
