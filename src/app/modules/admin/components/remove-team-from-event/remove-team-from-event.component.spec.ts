import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTeamFromEventComponent } from './remove-team-from-event.component';

describe('RemoveTeamFromEventComponent', () => {
  let component: RemoveTeamFromEventComponent;
  let fixture: ComponentFixture<RemoveTeamFromEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveTeamFromEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveTeamFromEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
