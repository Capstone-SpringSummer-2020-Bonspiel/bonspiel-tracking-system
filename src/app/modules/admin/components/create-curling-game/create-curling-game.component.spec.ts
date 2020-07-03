import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurlingGameComponent } from './create-curling-game.component';

describe('CreateCurlingGameComponent', () => {
  let component: CreateCurlingGameComponent;
  let fixture: ComponentFixture<CreateCurlingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCurlingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCurlingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
