import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bullet1Component } from './bullet-1.component';

describe('Bullet1Component', () => {
  let component: Bullet1Component;
  let fixture: ComponentFixture<Bullet1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bullet1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bullet1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
