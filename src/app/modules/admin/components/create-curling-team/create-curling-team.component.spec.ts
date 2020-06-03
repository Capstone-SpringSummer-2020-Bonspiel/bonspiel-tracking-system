import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurlingTeamComponent } from './create-curling-team.component';

describe('CreateCurlingTeamComponent', () => {
  let component: CreateCurlingTeamComponent;
  let fixture: ComponentFixture<CreateCurlingTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCurlingTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCurlingTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
