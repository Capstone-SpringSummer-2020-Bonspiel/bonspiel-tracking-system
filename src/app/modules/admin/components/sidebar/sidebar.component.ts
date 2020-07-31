import { Component, OnInit } from '@angular/core';
import { User } from '@core/_models';
import { AccountService } from '@app/core/_services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  images = [
    'https://img.bleacherreport.net/img/images/photos/002/759/669/3285d97ba0a774103d07f9257dd0a13c_crop_north.jpg?h=533&w=800&q=70&crop_x=center&crop_y=top',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQDFl2Z9jenmkayVhWMmUSBzYjIk7nyemhm0A&usqp=CAU',
    'https://www.sportsdestinations.com/files/sports_destination_management/nodes/2018/15024/USAC2_0.jpg'
  ];

  randomElement = this.images[Math.floor(Math.random() * this.images.length)];

  mainRoutes = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: 'dashboard',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Batch Upload',
      path: '/admin/file-upload',
      icon: 'cloud_upload',
      class: 'd-none d-sm-block'
    },
  ]

  addRoutes = [
    {
      label: 'Add a Organization',
      path: '/admin/create-organization',
      icon: 'add_box',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add a Team',
      path: '/admin/create-team',
      icon: 'group_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add a Team to an Event',
      path: '/admin/add-team-to-event',
      icon: 'group_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add a Curler',
      path: '/admin/create-curler',
      icon: 'person_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add a Pool',
      path: '/admin/create-pool',
      icon: 'library_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add a Bracket',
      path: '/admin/create-bracket',
      icon: 'library_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add an Event',
      path: '/admin/create-event',
      icon: 'calendar_today',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Add a Draw',
      path: '/admin/create-draw',
      icon: 'date_range',
      class: ''
    },
    {
      label: 'Add a Game',
      path: '/admin/create-game',
      icon: 'event',
      class: ''
    },
    {
      label: 'Add an End Score',
      path: '/admin/create-endscore',
      icon: 'plus_one',
      class: ''
    }
  ]

  editRoutes = [
    {
      label: 'Edit an Organization',
      path: '/admin/edit-organization',
      icon: 'add_box',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Edit a Team',
      path: '/admin/edit-team',
      icon: 'group_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Edit a Curler',
      path: '/admin/edit-curler',
      icon: 'person_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Edit a Pool',
      path: '/admin/edit-pool',
      icon: 'library_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Edit a Bracket',
      path: '/admin/edit-bracket',
      icon: 'library_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Edit an Event',
      path: '/admin/edit-event',
      icon: 'calendar_today',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Edit a Draw',
      path: '/admin/edit-draw',
      icon: 'date_range',
      class: ''
    },
    {
      label: 'Edit a Game',
      path: '/admin/edit-game',
      icon: 'event',
      class: ''
    },
    {
      label: 'Edit an End Score',
      path: '/admin/edit-endscore',
      icon: 'plus_one',
      class: ''
    }
  ]

  removeRoutes = [
    {
      label: 'Remove an Organization',
      path: '/admin/remove-organization',
      icon: 'add_box',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove a Team',
      path: '/admin/remove-team',
      icon: 'group_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove a Team from an Event',
      path: '/admin/remove-team-from-event',
      icon: 'group_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove a Curler',
      path: '/admin/remove-curler',
      icon: 'person_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove a Pool',
      path: '/admin/remove-pool',
      icon: 'library_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove a Bracket',
      path: '/admin/remove-bracket',
      icon: 'library_add',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove an Event',
      path: '/admin/remove-event',
      icon: 'calendar_today',
      class: 'd-none d-sm-block'
    },
    {
      label: 'Remove a Draw',
      path: '/admin/remove-draw',
      icon: 'date_range',
      class: ''
    },
    {
      label: 'Remove a Game',
      path: '/admin/remove-game',
      icon: 'event',
      class: ''
    },
    {
      label: 'Remove an End Score',
      path: '/admin/remove-endscore',
      icon: 'plus_one',
      class: ''
    }
  ]

  user: User;

  constructor(private accountService: AccountService) {
    this.accountService.user$.subscribe(user => {
      this.user = user;
      // console.log(this.user);
    });
  }

  ngOnInit(): void { }
}
