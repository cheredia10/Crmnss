import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tag1Component } from './tag-1.component';

describe('Tag1Component', () => {
  let component: Tag1Component;
  let fixture: ComponentFixture<Tag1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tag1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tag1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
