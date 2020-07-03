import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurlerComponent } from './edit-curler.component';

describe('EditCurlerComponent', () => {
  let component: EditCurlerComponent;
  let fixture: ComponentFixture<EditCurlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCurlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCurlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
