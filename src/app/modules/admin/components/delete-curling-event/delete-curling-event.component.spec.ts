import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCurlingEventComponent } from './delete-curling-event.component';

describe('DeleteCurlingEventComponent', () => {
  let component: DeleteCurlingEventComponent;
  let fixture: ComponentFixture<DeleteCurlingEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCurlingEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCurlingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
