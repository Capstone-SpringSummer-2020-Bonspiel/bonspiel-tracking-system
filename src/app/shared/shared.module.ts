import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { EventFilterPipe } from './pipes/event-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxSpinnerModule,
  ],
  declarations: [
    ControlMessagesComponent,
    SpinnerComponent,
    PageNotFoundComponent,
    FormatDatePipe,
    EventFilterPipe,
  ],
  exports: [
    ControlMessagesComponent,
    PageNotFoundComponent,
    SpinnerComponent,
    EventFilterPipe
  ],
  providers: [SpinnerService],
})
export class SharedModule { }
