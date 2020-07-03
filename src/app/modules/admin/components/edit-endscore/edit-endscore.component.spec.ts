import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEndscoreComponent } from './edit-endscore.component';

describe('EditEndscoreComponent', () => {
  let component: EditEndscoreComponent;
  let fixture: ComponentFixture<EditEndscoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEndscoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEndscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
