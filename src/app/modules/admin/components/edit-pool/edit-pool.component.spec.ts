import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPoolComponent } from './edit-pool.component';

describe('EditPoolComponent', () => {
  let component: EditPoolComponent;
  let fixture: ComponentFixture<EditPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
