import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrawComponent } from './edit-draw.component';

describe('EditDrawComponent', () => {
  let component: EditDrawComponent;
  let fixture: ComponentFixture<EditDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
