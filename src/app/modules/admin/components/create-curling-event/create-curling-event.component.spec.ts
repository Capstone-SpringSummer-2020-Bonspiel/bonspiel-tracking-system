import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurlingEventComponent } from './create-curling-event.component';

describe('CreateCurlingEventComponent', () => {
  let component: CreateCurlingEventComponent;
  let fixture: ComponentFixture<CreateCurlingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCurlingEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCurlingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
