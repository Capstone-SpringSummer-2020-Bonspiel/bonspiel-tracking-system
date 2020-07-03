import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBracketComponent } from './remove-bracket.component';

describe('RemoveBracketComponent', () => {
  let component: RemoveBracketComponent;
  let fixture: ComponentFixture<RemoveBracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveBracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveBracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
