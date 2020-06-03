import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-create-curling-event',
  templateUrl: './create-curling-event.component.html',
  styleUrls: ['./create-curling-event.component.scss'],
})
export class CreateCurlingEventComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }

  createOrganization() {
    console.log(`full name: ${this.firstFormGroup.value.firstCtrl}`);
    console.log(`short name: ${this.secondFormGroup.value.secondCtrl}`);
  }
}
