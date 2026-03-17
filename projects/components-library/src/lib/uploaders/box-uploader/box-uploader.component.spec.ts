import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxUploaderComponent } from './box-uploader.component';

describe('BoxUploaderComponent', () => {
  let component: BoxUploaderComponent;
  let fixture: ComponentFixture<BoxUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
