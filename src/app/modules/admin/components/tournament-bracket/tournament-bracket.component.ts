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

  data = [];

  curve = shape.curveLinear;

  constructor(
    private apiService: ApiService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    //this.spinnerService.on();
    console.log(`eventId= ${this.childMessage}`);
    this.apiService.generateBracket(this.childMessage).subscribe((res: any) => {
      console.log('response');
      console.log(res);
      this.data = res;
      //this.spinnerService.off();
    });
    console.log('data=');
    console.log(this.data);

    // for (var i = 0; i < jsonData.edges.length; i++) {
    //   this.edges.push(jsonData.edges[i]);
    // }

    // for (var i = 0; i < jsonData.nodes.length; i++) {
    //   this.nodes.push(jsonData.nodes[i]);
    // }

    console.log('this.edges=');
    console.log(this.edges);
    console.log('this.nodes=');
    console.log(this.nodes);
  }
}

const jsonData = {
  nodes: [
    {
      id: '826',
      label: 'Olsen Twins & Co vs Team Zissou',
    },
    {
      id: '834',
      label: 'Olsen Twins & Co vs The Slide Rulers',
    },
    {
      id: '830',
      label: 'A Series of Unfortunate Ends vs Grosse Pointe Blank Ends',
    },
    {
      id: '814',
      label: 'A Series of Unfortunate Ends vs Olsen Twins & Co',
    },
    {
      id: '838',
      label: 'A Series of Unfortunate Ends vs Junk Up the Front',
    },
    {
      id: '808',
      label: '#curlsquad vs Double - Double Ds',
    },
    {
      id: '820',
      label: '#curlsquad vs Casablankends',
    },
    {
      id: '804',
      label: 'Team Zissou vs SL,UTs',
    },
    {
      id: '836',
      label: 'Ill Fill This In Later vs Hack to the Future',
    },
    {
      id: '824',
      label: 'Ill Fill This In Later vs Flock Yeah',
    },
    {
      id: '844',
      label: 'Ill Fill This In Later vs Olsen Twins & Co',
    },
    {
      id: '843',
      label: '2 Girls and Some Wildmen vs Thats What She Said',
    },
    {
      id: '811',
      label: '2 Girls and Some Wildmen vs Flock Yeah',
    },
    {
      id: '822',
      label: 'Hack to the Future vs Hold Em to 1',
    },
    {
      id: '829',
      label: 'SL,UTs vs Bulls Team Awesome',
    },
    {
      id: '815',
      label: 'SL,UTs vs Curlers of the Lost Arc',
    },
    {
      id: '828',
      label: 'The Slide Rulers vs #curlsquad',
    },
    {
      id: '806',
      label: 'The Slide Rulers vs Sea Org Rejects',
    },
    {
      id: '801',
      label: 'Thats What She Said vs A Series of Unfortunate Ends',
    },
    {
      id: '833',
      label: 'Thats What She Said vs Team Umali',
    },
    {
      id: '813',
      label: 'Thats What She Said vs Bulls Team Awesome',
    },
    {
      id: '842',
      label: 'Hold Em to 1 vs A Series of Unfortunate Ends',
    },
    {
      id: '825',
      label:
        'Danknasty Curling Presented by CurlingZone vs Thats What She Said',
    },
    {
      id: '803',
      label:
        'Danknasty Curling Presented by CurlingZone vs Grosse Pointe Blank Ends',
    },
    {
      id: '827',
      label: 'Sea Org Rejects vs Team Umali',
    },
    {
      id: '816',
      label: 'Junk Up the Front vs Grosse Pointe Blank Ends',
    },
    {
      id: '818',
      label: 'Junk Up the Front vs The Slide Rulers',
    },
    {
      id: '832',
      label: 'Junk Up the Front vs Casablankends',
    },
    {
      id: '840',
      label: 'Flock Yeah vs Hold Em to 1',
    },
    {
      id: '835',
      label: 'Mystery Inc. vs 2 Girls and Some Wildmen',
    },
    {
      id: '809',
      label: 'Mystery Inc. vs Hold Em to 1',
    },
    {
      id: '812',
      label: 'The Jerks vs Ill Fill This In Later',
    },
    {
      id: '841',
      label: 'The Jerks vs SL,UTs',
    },
    {
      id: '823',
      label: 'The Jerks vs 2 Girls and Some Wildmen',
    },
    {
      id: '807',
      label: 'Team Umali vs Casablankends',
    },
    {
      id: '819',
      label: 'Double - Double Ds vs Team Umali',
    },
    {
      id: '837',
      label: 'Double - Double Ds vs SL,UTs',
    },
    {
      id: '821',
      label: 'Curlers of the Lost Arc vs Mystery Inc.',
    },
    {
      id: '810',
      label: 'Curlers of the Lost Arc vs Hack to the Future',
    },
    {
      id: '839',
      label: 'Curlers of the Lost Arc vs The Jerks',
    },
    {
      id: '802',
      label: 'Bulls Team Awesome vs Olsen Twins & Co',
    },
    {
      id: '817',
      label: 'Angry Canadiens vs Sea Org Rejects',
    },
    {
      id: '805',
      label: 'Angry Canadiens vs Junk Up the Front',
    },
    {
      id: '831',
      label: 'Angry Canadiens vs Double - Double Ds',
    },
  ],
  edges: [
    {
      source: '814',
      target: '826',
    },
    {
      source: '814',
      target: '830',
    },
    {
      source: '808',
      target: '820',
    },
    {
      source: '808',
      target: '819',
    },
    {
      source: '820',
      target: '828',
    },
    {
      source: '820',
      target: '832',
    },
    {
      source: '804',
      target: '816',
    },
    {
      source: '804',
      target: '815',
    },
    {
      source: '824',
      target: '836',
    },
    {
      source: '824',
      target: '840',
    },
    {
      source: '811',
      target: '824',
    },
    {
      source: '811',
      target: '823',
    },
    {
      source: '822',
      target: '836',
    },
    {
      source: '822',
      target: '840',
    },
    {
      source: '815',
      target: '825',
    },
    {
      source: '815',
      target: '829',
    },
    {
      source: '806',
      target: '818',
    },
    {
      source: '806',
      target: '817',
    },
    {
      source: '801',
      target: '814',
    },
    {
      source: '801',
      target: '813',
    },
    {
      source: '813',
      target: '825',
    },
    {
      source: '813',
      target: '829',
    },
    {
      source: '803',
      target: '816',
    },
    {
      source: '803',
      target: '815',
    },
    {
      source: '816',
      target: '826',
    },
    {
      source: '816',
      target: '830',
    },
    {
      source: '818',
      target: '828',
    },
    {
      source: '818',
      target: '832',
    },
    {
      source: '809',
      target: '822',
    },
    {
      source: '809',
      target: '821',
    },
    {
      source: '812',
      target: '824',
    },
    {
      source: '812',
      target: '823',
    },
    {
      source: '823',
      target: '835',
    },
    {
      source: '823',
      target: '839',
    },
    {
      source: '807',
      target: '820',
    },
    {
      source: '807',
      target: '819',
    },
    {
      source: '819',
      target: '827',
    },
    {
      source: '819',
      target: '831',
    },
    {
      source: '821',
      target: '835',
    },
    {
      source: '821',
      target: '839',
    },
    {
      source: '810',
      target: '822',
    },
    {
      source: '810',
      target: '821',
    },
    {
      source: '802',
      target: '814',
    },
    {
      source: '802',
      target: '813',
    },
    {
      source: '817',
      target: '827',
    },
    {
      source: '817',
      target: '831',
    },
    {
      source: '805',
      target: '818',
    },
    {
      source: '805',
      target: '817',
    },
  ],
};
