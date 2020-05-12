import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorComponent } from './components/visitor/visitor.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    VisitorComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule
  ],
  exports: [
    VisitorComponent,
  ]
})
export class VisitorModule { }
