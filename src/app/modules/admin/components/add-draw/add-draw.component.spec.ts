import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrawComponent } from './add-draw.component';

describe('AddDrawComponent', () => {
  let component: AddDrawComponent;
  let fixture: ComponentFixture<AddDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
