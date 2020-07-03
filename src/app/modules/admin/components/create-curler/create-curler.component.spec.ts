import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCurlerComponent } from './create-curler.component';

describe('CreateCurlerComponent', () => {
  let component: CreateCurlerComponent;
  let fixture: ComponentFixture<CreateCurlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCurlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCurlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
