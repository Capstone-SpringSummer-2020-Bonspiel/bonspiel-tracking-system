import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-create-curling-team',
  templateUrl: './create-curling-team.component.html',
  styleUrls: ['./create-curling-team.component.scss'],
})
export class CreateCurlingTeamComponent implements OnInit {
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
