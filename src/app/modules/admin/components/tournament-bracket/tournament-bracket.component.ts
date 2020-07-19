import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss'],
})
export class TournamentBracketComponent implements OnInit {
  nodes = [];

  edges = [];

  curve = shape.curveLinear;

  constructor() {}

  ngOnInit(): void {
    console.log('jsonData=');
    console.log(jsonData);

    for (var i = 0; i < jsonData.edges.length; i++) {
      this.edges.push(jsonData.edges[i]);
    }

    for (var i = 0; i < jsonData.nodes.length; i++) {
      this.nodes.push(jsonData.nodes[i]);
    }
    this.edges.sort((a, b) => (a.target > b.target ? 1 : -1));
    this.nodes.sort((a, b) => (a.id > b.id ? 1 : -1));

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
      id: '820',
      label: '#curlsquad vs Casablankends',
    },
    {
      id: '808',
      label: '#curlsquad vs Double - Double Ds',
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
      id: '841',
      label: 'The Jerks vs SL,UTs',
    },
    {
      id: '812',
      label: 'The Jerks vs Ill Fill This In Later',
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
      id: '839',
      label: 'Curlers of the Lost Arc vs The Jerks',
    },
    {
      id: '810',
      label: 'Curlers of the Lost Arc vs Hack to the Future',
    },
    {
      id: '821',
      label: 'Curlers of the Lost Arc vs Mystery Inc.',
    },
    {
      id: '802',
      label: 'Bulls Team Awesome vs Olsen Twins & Co',
    },
    {
      id: '831',
      label: 'Angry Canadiens vs Double - Double Ds',
    },
    {
      id: '817',
      label: 'Angry Canadiens vs Sea Org Rejects',
    },
    {
      id: '805',
      label: 'Angry Canadiens vs Junk Up the Front',
    },
  ],
  edges: [
    {
      id: '0',
      source: '814',
      target: '826',
    },
    {
      id: '1',
      source: '814',
      target: '830',
    },
    {
      id: '2',
      source: '820',
      target: '828',
    },
    {
      id: '3',
      source: '820',
      target: '832',
    },
    {
      id: '4',
      source: '808',
      target: '820',
    },
    {
      id: '5',
      source: '808',
      target: '819',
    },
    {
      id: '6',
      source: '804',
      target: '816',
    },
    {
      id: '7',
      source: '804',
      target: '815',
    },
    {
      id: '8',
      source: '824',
      target: '836',
    },
    {
      id: '9',
      source: '824',
      target: '840',
    },
    {
      id: '10',
      source: '811',
      target: '824',
    },
    {
      id: '11',
      source: '811',
      target: '823',
    },
    {
      id: '12',
      source: '822',
      target: '836',
    },
    {
      id: '13',
      source: '822',
      target: '840',
    },
    {
      id: '14',
      source: '815',
      target: '825',
    },
    {
      id: '15',
      source: '815',
      target: '829',
    },
    {
      id: '16',
      source: '806',
      target: '818',
    },
    {
      id: '17',
      source: '806',
      target: '817',
    },
    {
      id: '18',
      source: '801',
      target: '814',
    },
    {
      id: '19',
      source: '801',
      target: '813',
    },
    {
      id: '20',
      source: '813',
      target: '825',
    },
    {
      id: '21',
      source: '813',
      target: '829',
    },
    {
      id: '22',
      source: '803',
      target: '816',
    },
    {
      id: '23',
      source: '803',
      target: '815',
    },
    {
      id: '24',
      source: '816',
      target: '826',
    },
    {
      id: '25',
      source: '816',
      target: '830',
    },
    {
      id: '26',
      source: '818',
      target: '828',
    },
    {
      id: '27',
      source: '818',
      target: '832',
    },
    {
      id: '28',
      source: '809',
      target: '822',
    },
    {
      id: '29',
      source: '809',
      target: '821',
    },
    {
      id: '30',
      source: '812',
      target: '824',
    },
    {
      id: '31',
      source: '812',
      target: '823',
    },
    {
      id: '32',
      source: '823',
      target: '835',
    },
    {
      id: '33',
      source: '823',
      target: '839',
    },
    {
      id: '34',
      source: '807',
      target: '820',
    },
    {
      id: '35',
      source: '807',
      target: '819',
    },
    {
      id: '36',
      source: '819',
      target: '827',
    },
    {
      id: '37',
      source: '819',
      target: '831',
    },
    {
      id: '38',
      source: '810',
      target: '822',
    },
    {
      id: '39',
      source: '810',
      target: '821',
    },
    {
      id: '40',
      source: '821',
      target: '835',
    },
    {
      id: '41',
      source: '821',
      target: '839',
    },
    {
      id: '42',
      source: '802',
      target: '814',
    },
    {
      id: '43',
      source: '802',
      target: '813',
    },
    {
      id: '44',
      source: '817',
      target: '827',
    },
    {
      id: '45',
      source: '817',
      target: '831',
    },
    {
      id: '46',
      source: '805',
      target: '818',
    },
    {
      id: '47',
      source: '805',
      target: '817',
    },
  ],
};
