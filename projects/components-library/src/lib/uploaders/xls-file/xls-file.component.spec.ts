import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsFileComponent } from './xls-file.component';

describe('XlsFileComponent', () => {
  let component: XlsFileComponent;
  let fixture: ComponentFixture<XlsFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XlsFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XlsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
