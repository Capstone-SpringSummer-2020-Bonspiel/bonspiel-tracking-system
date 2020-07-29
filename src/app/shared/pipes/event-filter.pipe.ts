import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventCompleted'
})
export class EventFilterPipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.completed === 'true');
  }
}
