import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panel1Component } from './panel-1.component';

describe('Panel1Component', () => {
  let component: Panel1Component;
  let fixture: ComponentFixture<Panel1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panel1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
