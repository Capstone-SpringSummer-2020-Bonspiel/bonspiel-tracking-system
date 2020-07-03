import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveGameComponent } from './remove-game.component';

describe('RemoveGameComponent', () => {
  let component: RemoveGameComponent;
  let fixture: ComponentFixture<RemoveGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
