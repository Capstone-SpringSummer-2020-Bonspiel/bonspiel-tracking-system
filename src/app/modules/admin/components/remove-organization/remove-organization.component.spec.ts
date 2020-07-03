import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOrganizationComponent } from './remove-organization.component';

describe('RemoveOrganizationComponent', () => {
  let component: RemoveOrganizationComponent;
  let fixture: ComponentFixture<RemoveOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveOrganizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
