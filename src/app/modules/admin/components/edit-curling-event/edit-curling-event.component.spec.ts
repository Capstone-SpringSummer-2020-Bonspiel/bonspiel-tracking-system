import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurlingEventComponent } from './edit-curling-event.component';

describe('EditCurlingEventComponent', () => {
  let component: EditCurlingEventComponent;
  let fixture: ComponentFixture<EditCurlingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCurlingEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCurlingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
