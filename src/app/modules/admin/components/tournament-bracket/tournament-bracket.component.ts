import { Component, OnInit, Input } from '@angular/core';
import * as shape from 'd3-shape';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss']
})
export class TournamentBracketComponent implements OnInit {

  curve = shape.curveLinear;

  public nodes = [];
  public edges = [];
  public data = null;

  @Input() set message(data: any) {
    console.log('nodes', data.nodes);
    console.log('edges', data.edges);
    this.data = data;
  };
  get message() { return this.data }

  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();

  constructor() { }

  ngOnInit(): void { }

  centerGraph() {
    this.center$.next(true)
  }

  fitGraph() {
    this.zoomToFit$.next(true)
  }

  updateGraph() {

    // let newNodes = [
    //   { id: '801', label: 'this is a very long text used as a test 24 vs. 16 (801)' },
    //   { id: '803', label: 'this is a very long text used as a test 26 vs. 30 (803)' },
    //   { id: '804', label: 'this is a very long text used as a test 18 vs. 22 (804)' },
    //   { id: '802', label: 'this is a very long text used as a test 37 vs. 15 (802)' },
    //   { id: '807', label: 'this is a very long text used as a test 34 vs. 31 (807)' },
    //   { id: '808', label: 'this is a very long text used as a test 17 vs. 35 (808)' },
    //   { id: '806', label: 'this is a very long text used as a test 23 vs. 27 (806)' },
    //   { id: '805', label: 'this is a very long text used as a test 38 vs. 28 (805)' },
    //   { id: '809', label: 'this is a very long text used as a test 32 vs. 25 (809)' },
    //   { id: '814', label: 'this is a very long text used as a test 16 vs. 15 (814)' },
    //   { id: '811', label: 'this is a very long text used as a test 20 vs. 29 (811)' },
    //   { id: '812', label: 'this is a very long text used as a test 33 vs. 19 (812)' },
    //   { id: '810', label: 'this is a very long text used as a test 36 vs. 21 (810)' },
    //   { id: '815', label: 'this is a very long text used as a test 22 vs. 36 (815)' },
    //   { id: '813', label: 'this is a very long text used as a test 24 vs. 37 (813)' },
    //   { id: '817', label: 'this is a very long text used as a test 38 vs. 27 (817)' },
    //   { id: '818', label: 'this is a very long text used as a test 28 vs. 23 (818)' },
    //   { id: '816', label: 'this is a very long text used as a test 28 vs. 30 (816)' },
    //   { id: '824', label: 'this is a very long text used as a test 19 vs. 29 (824)' },
    //   { id: '822', label: 'this is a very long text used as a test 21 vs. 25 (822)' },
    //   { id: '821', label: 'this is a very long text used as a test 36 vs. 32 (821)' },
    //   { id: '820', label: 'this is a very long text used as a test 17 vs. 31 (820)' },
    //   { id: '819', label: 'this is a very long text used as a test 35 vs. 34 (819)' },
    //   { id: '828', label: 'this is a very long text used as a test 23 vs. 17 (828)' },
    //   { id: '827', label: 'this is a very long text used as a test 27 vs. 34 (827)' },
    //   { id: '826', label: 'this is a very long text used as a test 15 vs. 18 (826)' },
    //   { id: '825', label: 'this is a very long text used as a test 26 vs. 24 (825)' },
    //   { id: '823', label: 'this is a very long text used as a test 33 vs. 20 (823)' },
    //   { id: '832', label: 'this is a very long text used as a test 28 vs. 31 (832)' },
    //   { id: '831', label: 'this is a very long text used as a test 38 vs. 35 (831)' },
    //   { id: '830', label: 'this is a very long text used as a test 16 vs. 30 (830)' },
    //   { id: '840', label: 'this is a very long text used as a test 29 vs. 25 (840)' },
    //   { id: '829', label: 'this is a very long text used as a test 22 vs. 37 (829)' },
    //   { id: '839', label: 'this is a very long text used as a test 36 vs. 33 (839)' },
    //   { id: '835', label: 'this is a very long text used as a test 32 vs. 20 (835)' },
    //   { id: '836', label: 'this is a very long text used as a test 19 vs. 21 (836)' },
    //   { id: '834', label: 'this is a very long text used as a test 15 vs. 23 (834)' },
    //   { id: '833', label: 'this is a very long text used as a test 24 vs. 34 (833)' },
    //   { id: '837', label: 'this is a very long text used as a test 35 vs. 22 (837)' },
    //   { id: '838', label: 'this is a very long text used as a test 16 vs. 28 (838)' },
    //   { id: '844', label: 'this is a very long text used as a test 19 vs. 15 (844)' },
    //   { id: '842', label: 'this is a very long text used as a test 25 vs. 16 (842)' },
    //   { id: '843', label: 'this is a very long text used as a test 20 vs. 24 (843)' },
    //   { id: '841', label: 'this is a very long text used as a test 33 vs. 22 (841)' },
    // ]

    // let newEdges = [
    //   { id: '', source: '801', target: '814', label: '' },
    //   { id: '', source: '803', target: '816', label: '' },
    //   { id: '', source: '804', target: '816', label: '' },
    //   { id: '', source: '802', target: '814', label: '' },
    //   { id: '', source: '807', target: '820', label: '' },
    //   { id: '', source: '808', target: '820', label: '' },
    //   { id: '', source: '806', target: '818', label: '' },
    //   { id: '', source: '805', target: '818', label: '' },
    //   { id: '', source: '809', target: '822', label: '' },
    //   { id: '', source: '814', target: '826', label: '' },
    //   { id: '', source: '811', target: '824', label: '' },
    //   { id: '', source: '812', target: '824', label: '' },
    //   { id: '', source: '810', target: '822', label: '' },
    //   { id: '', source: '815', target: '825', label: '' },
    //   { id: '', source: '813', target: '825', label: '' },
    //   { id: '', source: '817', target: '827', label: '' },
    //   { id: '', source: '818', target: '828', label: '' },
    //   { id: '', source: '816', target: '826', label: '' },
    //   { id: '', source: '824', target: '836', label: '' },
    //   { id: '', source: '822', target: '836', label: '' },
    //   { id: '', source: '821', target: '835', label: '' },
    //   { id: '', source: '820', target: '828', label: '' },
    //   { id: '', source: '819', target: '827', label: '' },
    //   { id: '', source: '828', target: '834', label: '' },
    //   { id: '', source: '827', target: '833', label: '' },
    //   { id: '', source: '826', target: '834', label: '' },
    //   { id: '', source: '825', target: '833', label: '' },
    //   { id: '', source: '823', target: '835', label: '' },
    //   { id: '', source: '832', target: '838', label: '' },
    //   { id: '', source: '831', target: '837', label: '' },
    //   { id: '', source: '830', target: '838', label: '' },
    //   { id: '', source: '840', target: '842', label: '' },
    //   { id: '', source: '829', target: '837', label: '' },
    //   { id: '', source: '839', target: '841', label: '' },
    //   { id: '', source: '835', target: '843', label: '' },
    //   { id: '', source: '836', target: '844', label: '' },
    //   { id: '', source: '834', target: '844', label: '' },
    //   { id: '', source: '833', target: '843', label: '' },
    //   { id: '', source: '837', target: '841', label: '' },
    //   { id: '', source: '838', target: '842', label: '' },
    // ]

    let newNodes = this.data.nodes;
    let newEdges = this.data.edges;

    // Clear arrays
    this.nodes.length = 0;
    this.edges.length = 0;

    // Push new nodes/edges
    for (let newNode of newNodes) {
      this.nodes.push(newNode);
    }
    for (let newEdge of newEdges) {
      this.edges.push(newEdge);
    }

    // Set new nodes/edges
    this.nodes = [...this.nodes];
    this.edges = [...this.edges];

    // Load new nodes/edges by triggering change detection
    this.update$.next(true)
  }
}
