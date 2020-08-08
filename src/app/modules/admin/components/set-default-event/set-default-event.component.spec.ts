import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDefaultEventComponent } from './set-default-event.component';

describe('SetDefaultEventComponent', () => {
  let component: SetDefaultEventComponent;
  let fixture: ComponentFixture<SetDefaultEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetDefaultEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDefaultEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
