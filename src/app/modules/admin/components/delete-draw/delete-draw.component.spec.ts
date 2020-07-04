import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDrawComponent } from './delete-draw.component';

describe('DeleteDrawComponent', () => {
  let component: DeleteDrawComponent;
  let fixture: ComponentFixture<DeleteDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
