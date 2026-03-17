import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocxFileComponent } from './docx-file.component';

describe('DocxFileComponent', () => {
  let component: DocxFileComponent;
  let fixture: ComponentFixture<DocxFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocxFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocxFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
