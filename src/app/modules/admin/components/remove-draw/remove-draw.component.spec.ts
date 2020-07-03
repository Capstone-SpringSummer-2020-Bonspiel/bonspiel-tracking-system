import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDrawComponent } from './remove-draw.component';

describe('RemoveDrawComponent', () => {
  let component: RemoveDrawComponent;
  let fixture: ComponentFixture<RemoveDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
