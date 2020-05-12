import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/http/api.service';

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.scss']
})
export class VisitorComponent implements OnInit {

  displayedColumns = [
    'name',
    'home',
    'round_1',
    'round_2',
    'round_3',
    'round_4',
    'round_5',
    'round_6',
    'round_7',
    'round_8',
    'final_score',
  ];
  dataSource = BONSPIEL_DATA;

  constructor(private apiService: ApiService) {
    this.apiService.getBeer().subscribe((res) => {
      console.log(res);
    });
  }

  ngOnInit(): void {

  }

}

export interface PeriodicElement {
  name: string;
  home: string;
  round_1: string;
  round_2: string;
  round_3: string;
  round_4: string;
  round_5: string;
  round_6: string;
  round_7: string;
  round_8: string;
  final_score: string;
}

const BONSPIEL_DATA: PeriodicElement[] = [
  {
    name: 'team1',
    home: '*',
    round_1: '1',
    round_2: '2',
    round_3: '3',
    round_4: '4',
    round_5: '5',
    round_6: '6',
    round_7: '7',
    round_8: '8',
    final_score: '36',
  },
  {
    name: 'team2',
    home: '*',
    round_1: '1',
    round_2: '2',
    round_3: '3',
    round_4: '4',
    round_5: '5',
    round_6: '6',
    round_7: '7',
    round_8: '8',
    final_score: '36',
  },
  {
    name: 'team3',
    home: '*',
    round_1: '1',
    round_2: '2',
    round_3: '3',
    round_4: '4',
    round_5: '5',
    round_6: '6',
    round_7: '7',
    round_8: '8',
    final_score: '36',
  },
  {
    name: 'team4',
    home: '*',
    round_1: '1',
    round_2: '2',
    round_3: '3',
    round_4: '4',
    round_5: '5',
    round_6: '6',
    round_7: '7',
    round_8: '8',
    final_score: '36',
  },
  {
    name: 'team5',
    home: '*',
    round_1: '1',
    round_2: '2',
    round_3: '3',
    round_4: '4',
    round_5: '5',
    round_6: '6',
    round_7: '7',
    round_8: '8',
    final_score: '36',
  },

  // {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  // {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  // {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  // {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  // {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  // {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  // {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},

];