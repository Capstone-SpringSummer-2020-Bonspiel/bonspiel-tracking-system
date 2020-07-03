import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCurlingGameComponent } from './edit-curling-game.component';

describe('EditCurlingGameComponent', () => {
  let component: EditCurlingGameComponent;
  let fixture: ComponentFixture<EditCurlingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCurlingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCurlingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
