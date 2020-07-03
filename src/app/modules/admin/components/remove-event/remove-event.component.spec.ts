import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEventComponent } from './remove-event.component';

describe('RemoveEventComponent', () => {
  let component: RemoveEventComponent;
  let fixture: ComponentFixture<RemoveEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
