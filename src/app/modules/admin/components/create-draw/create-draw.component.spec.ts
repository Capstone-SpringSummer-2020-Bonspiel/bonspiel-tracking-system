import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrawComponent } from './create-draw.component';

describe('CreateDrawComponent', () => {
  let component: CreateDrawComponent;
  let fixture: ComponentFixture<CreateDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
