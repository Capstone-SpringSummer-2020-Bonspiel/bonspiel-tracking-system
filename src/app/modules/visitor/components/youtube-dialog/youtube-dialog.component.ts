import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Component({
  selector: 'app-youtube-dialog',
  templateUrl: './youtube-dialog.component.html',
  styleUrls: ['./youtube-dialog.component.scss'],
})
export class YoutubeDialogComponent implements OnInit {
  youtube_link = '';

  constructor(
    public dialogRef: MatDialogRef<YoutubeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer
  ) {
    this.youtube_link = data.youtube_link;
    console.log(this.youtube_link);
  }

  ngOnInit(): void {}

  sanitizeURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.youtube_link);
  }
}

export interface DialogData {
  youtube_link: string;
}
