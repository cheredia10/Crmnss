import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMainTitleComponent } from './form-main-title.component';

describe('FormMainTitleComponent', () => {
  let component: FormMainTitleComponent;
  let fixture: ComponentFixture<FormMainTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMainTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMainTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
