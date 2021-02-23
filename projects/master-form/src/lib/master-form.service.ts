import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MasterFormService {
  private ITEMS_RENDERED_AT_ONCE = 100;
  private INTERVAL_IN_MS = 20;

  constructor() { }

  public setItemsRenderedAtOnce(value: number) {
    this.ITEMS_RENDERED_AT_ONCE = value;
  }

  public getItemsRenderedAtOnce(): number {
    return this.ITEMS_RENDERED_AT_ONCE;
  }

  public setInterValInMs(value: number) {
    this.INTERVAL_IN_MS = value;
  }

  public getInterValInMs(): number {
    return this.INTERVAL_IN_MS;
  }

  /*
    this.masterFormService.buildData(500, (i) => {
      let t = { ...result };
      t.name = i + '-' + t.name;
      t.display = i + '-' + t.display;
      this.masterForms.push(t);
    }, () => {
      this.jsonData.next(this.masterForms);
    });
  */
  public buildData(length: number, func: Function, func_render: Function) {
    let currentIndex = 0;
    const interval = setInterval(() => {
      const nextIndex = currentIndex + this.ITEMS_RENDERED_AT_ONCE;
      for (let n = currentIndex; n <= nextIndex; n++) {
        if (n >= length) {
          clearInterval(interval);
          break;
        }
        func(n);
      }
      func_render();
      currentIndex += this.ITEMS_RENDERED_AT_ONCE;
    }, this.INTERVAL_IN_MS);
  }
}
