import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCurlingEventComponent } from './manage-curling-event.component';

describe('ManageCurlingEventComponent', () => {
  let component: ManageCurlingEventComponent;
  let fixture: ComponentFixture<ManageCurlingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCurlingEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCurlingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
