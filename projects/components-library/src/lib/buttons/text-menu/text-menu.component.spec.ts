import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextMenuComponent } from './text-menu.component';

describe('TextMenuComponent', () => {
  let component: TextMenuComponent;
  let fixture: ComponentFixture<TextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
