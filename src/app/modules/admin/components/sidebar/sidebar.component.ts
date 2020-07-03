import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  addRoutes = [
    {
      label: 'Add a new Event',
      path: '/admin/create-event',
      icon: 'calendar_today'
    },
    {
      label: 'Add a new Draw',
      path: '/admin/create-draw',
      icon: 'date_range'
    },
    {
      label: 'Add a new Game',
      path: '/admin/create-game',
      icon: 'event'
    },
    {
      label: 'Add a new Organization',
      path: '/admin/create-organization',
      icon: 'add_box'
    },
    {
      label: 'Add a new Team',
      path: '/admin/create-team',
      icon: 'group_add'
    },
    {
      label: 'Add a new Curler',
      path: '/admin/create-curler',
      icon: 'person_add'
    },
    {
      label: 'Add a new Pool',
      path: '/admin/create-pool',
      icon: 'library_add'
    },
    {
      label: 'Add a new Bracket',
      path: '/admin/create-bracket',
      icon: 'library_add'
    },
    {
      label: 'Add an Endscore',
      path: '/admin/create-endscore',
      icon: 'plus_one'
    }
  ]

  editRoutes = [
    {
      label: 'Edit an Event',
      path: '/admin/edit-event',
      icon: 'calendar_today'
    },
    {
      label: 'Edit a Draw',
      path: '/admin/edit-draw',
      icon: 'date_range'
    },
    {
      label: 'Edit a Game',
      path: '/admin/edit-game',
      icon: 'event'
    },
    {
      label: 'Edit an Organization',
      path: '/admin/edit-organization',
      icon: 'add_box'
    },
    {
      label: 'Edit a Team',
      path: '/admin/edit-team',
      icon: 'group_add'
    },
    {
      label: 'Edit a Curler',
      path: '/admin/edit-curler',
      icon: 'person_add'
    },
    {
      label: 'Edit a Pool',
      path: '/admin/edit-pool',
      icon: 'library_add'
    },
    {
      label: 'Edit a Bracket',
      path: '/admin/edit-bracket',
      icon: 'library_add'
    },
    {
      label: 'Edit an Endscore',
      path: '/admin/edit-endscore',
      icon: 'plus_one'
    }
  ]

  removeRoutes = [
    {
      label: 'Remove an Event',
      path: '/admin/remove-event',
      icon: 'calendar_today'
    },
    {
      label: 'Remove a Draw',
      path: '/admin/remove-draw',
      icon: 'date_range'
    },
    {
      label: 'Remove a Game',
      path: '/admin/remove-game',
      icon: 'event'
    },
    {
      label: 'Remove an Organization',
      path: '/admin/remove-organization',
      icon: 'add_box'
    },
    {
      label: 'Remove a Team',
      path: '/admin/remove-team',
      icon: 'group_add'
    },
    {
      label: 'Remove a Curler',
      path: '/admin/remove-curler',
      icon: 'person_add'
    },
    {
      label: 'Remove a Pool',
      path: '/admin/remove-pool',
      icon: 'library_add'
    },
    {
      label: 'Remove a Bracket',
      path: '/admin/remove-bracket',
      icon: 'library_add'
    },
    {
      label: 'Remove an Endscore',
      path: '/admin/remove-endscore',
      icon: 'plus_one'
    }
  ]


  constructor() { }

  ngOnInit(): void {
  }

}
