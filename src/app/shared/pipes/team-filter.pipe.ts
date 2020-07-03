import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamFilter'
})
export class TeamFilterPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    console.log(`FILTER: ${filter}`);
    return items.filter(item => item.team_id !== filter);
  }

}
