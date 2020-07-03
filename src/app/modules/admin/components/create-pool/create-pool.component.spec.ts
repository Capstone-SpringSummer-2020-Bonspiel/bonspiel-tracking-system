import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePoolComponent } from './create-pool.component';

describe('CreatePoolComponent', () => {
  let component: CreatePoolComponent;
  let fixture: ComponentFixture<CreatePoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
