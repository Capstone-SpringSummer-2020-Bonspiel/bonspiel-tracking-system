import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePoolComponent } from './remove-pool.component';

describe('RemovePoolComponent', () => {
  let component: RemovePoolComponent;
  let fixture: ComponentFixture<RemovePoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
