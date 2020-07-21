import { Component, OnInit, Input } from '@angular/core';
import * as shape from 'd3-shape';
import { ApiService } from '@app/core/api/api.service';
import { SpinnerService } from '@app/shared/services/spinner.service';

@Component({
  selector: 'app-tournament-bracket',
  template: `Say {{ message }}`,
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss'],
})
export class TournamentBracketComponent implements OnInit {
  @Input() childMessage: string;

  nodes = [];

  edges = [];

  curve = shape.curveLinear;

  constructor(
    private apiService: ApiService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.on();
    console.log(`eventId= ${this.childMessage}`);
    this.apiService.generateBracket(this.childMessage).subscribe((res: any) => {
      for (var i = 0; i < res.edges.length; i++) {
        this.edges.push(res.edges[i]);
      }

      for (var i = 0; i < res.nodes.length; i++) {
        this.nodes.push(res.nodes[i]);
      }

      //console.log('this.edges=');
      //console.log(this.edges);
      //console.log('this.nodes=');
      //console.log(this.nodes);

      this.spinnerService.off();
    });
  }
}
