import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEndscoreComponent } from './remove-endscore.component';

describe('RemoveEndscoreComponent', () => {
  let component: RemoveEndscoreComponent;
  let fixture: ComponentFixture<RemoveEndscoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveEndscoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveEndscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
