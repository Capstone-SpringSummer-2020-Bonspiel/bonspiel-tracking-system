import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDialogOverviewComponent } from './team-dialog-overview.component';

describe('TeamDialogOverviewComponent', () => {
  let component: TeamDialogOverviewComponent;
  let fixture: ComponentFixture<TeamDialogOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeamDialogOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDialogOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
