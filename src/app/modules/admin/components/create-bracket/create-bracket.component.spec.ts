import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBracketComponent } from './create-bracket.component';

describe('CreateBracketComponent', () => {
  let component: CreateBracketComponent;
  let fixture: ComponentFixture<CreateBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
