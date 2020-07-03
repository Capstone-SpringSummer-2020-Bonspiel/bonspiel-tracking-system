import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCurlerComponent } from './remove-curler.component';

describe('RemoveCurlerComponent', () => {
  let component: RemoveCurlerComponent;
  let fixture: ComponentFixture<RemoveCurlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCurlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCurlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
