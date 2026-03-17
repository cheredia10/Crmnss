import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JpgFileComponent } from './jpg-file.component';

describe('JpgFileComponent', () => {
  let component: JpgFileComponent;
  let fixture: ComponentFixture<JpgFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JpgFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JpgFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
