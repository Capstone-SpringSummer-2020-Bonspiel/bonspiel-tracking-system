import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionalsComponent } from './instructionals.component';

describe('InstructionalsComponent', () => {
  let component: InstructionalsComponent;
  let fixture: ComponentFixture<InstructionalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
