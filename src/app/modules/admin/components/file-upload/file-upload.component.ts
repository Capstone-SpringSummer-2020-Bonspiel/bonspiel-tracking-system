import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NotificationService } from '@app/shared/services/notification.service';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  form: FormGroup;
  progress: number = 0;

  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService,
    public notificationService: NotificationService,
    public spinnerService: SpinnerService
  ) {
    this.form = this.fb.group({
      fileData: [null]
    })
  }

  ngOnInit() { }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ fileData: file });
    this.form.get('fileData').updateValueAndValidity()
  }

  resetProgressBar() {
    setTimeout(() => {
      this.progress = 0;
    }, 100);
  }

  submitUpload() {
    console.log('submitUpload() executed!');
    this.spinnerService.on();

    this.fileUploadService.uploadFile(this.form.value.fileData)
      .subscribe(
        (event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              // this.notificationService.showInfo('Request has been made!', '');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              // this.notificationService.showInfo('Response header has been received!', '');
              break;
            case HttpEventType.UploadProgress:
              this.progress = Math.round(event.loaded / event.total * 100);
              console.log(`Uploaded! ${this.progress}%`);
              // this.notificationService.showInfo(`${this.progress}%`, 'Progress');
              break;
            case HttpEventType.Response:
              console.log('User successfully created!', event.body);
              this.notificationService.showSuccess('File successfully uploaded!', '');
          }
        },
        (err) => {
          console.log(err);
          this.notificationService.showError(err, 'Something went wrong');
        })
      .add(() => {
        this.resetProgressBar();
        this.form.reset();
        console.log('form', this.form);
        this.spinnerService.off();
      });
  }
}
