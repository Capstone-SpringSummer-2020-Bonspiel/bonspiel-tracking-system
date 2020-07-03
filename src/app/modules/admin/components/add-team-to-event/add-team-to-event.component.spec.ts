import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamToEventComponent } from './add-team-to-event.component';

describe('AddTeamToEventComponent', () => {
  let component: AddTeamToEventComponent;
  let fixture: ComponentFixture<AddTeamToEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamToEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamToEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
