import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEndscoreComponent } from './create-endscore.component';

describe('CreateEndscoreComponent', () => {
  let component: CreateEndscoreComponent;
  let fixture: ComponentFixture<CreateEndscoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEndscoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEndscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
