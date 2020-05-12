import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorComponent } from './components/visitor/visitor.component';



@NgModule({
  declarations: [VisitorComponent],
  imports: [
    CommonModule
  ],
  exports: [
    VisitorComponent
  ]
})
export class VisitorModule { }
