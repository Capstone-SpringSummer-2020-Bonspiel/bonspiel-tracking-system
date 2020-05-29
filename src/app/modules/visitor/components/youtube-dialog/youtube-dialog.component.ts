import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtube-dialog',
  templateUrl: './youtube-dialog.component.html',
  styleUrls: ['./youtube-dialog.component.scss'],
})
export class YoutubeDialogComponent implements OnInit {
  youtube_source = 'zesl6jZnSDM';

  constructor() {}

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}
