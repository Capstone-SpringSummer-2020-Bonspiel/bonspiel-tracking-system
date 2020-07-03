import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBracketComponent } from './edit-bracket.component';

describe('EditBracketComponent', () => {
  let component: EditBracketComponent;
  let fixture: ComponentFixture<EditBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
