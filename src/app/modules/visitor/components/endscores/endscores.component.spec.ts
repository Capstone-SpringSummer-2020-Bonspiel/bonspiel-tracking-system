import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndscoresComponent } from './endscores.component';

describe('EndscoresComponent', () => {
  let component: EndscoresComponent;
  let fixture: ComponentFixture<EndscoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndscoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndscoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
