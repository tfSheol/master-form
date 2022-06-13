import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class MasterFormService {
    constructor() {
        this.ITEMS_RENDERED_AT_ONCE = 100;
        this.INTERVAL_IN_MS = 20;
    }
    setItemsRenderedAtOnce(value) {
        this.ITEMS_RENDERED_AT_ONCE = value;
    }
    getItemsRenderedAtOnce() {
        return this.ITEMS_RENDERED_AT_ONCE;
    }
    setInterValInMs(value) {
        this.INTERVAL_IN_MS = value;
    }
    getInterValInMs() {
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
    buildData(length, func, func_render) {
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
MasterFormService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MasterFormService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLWZvcm0uc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL21hc3Rlci1mb3JtL3NyYy9saWIvbWFzdGVyLWZvcm0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUszQyxNQUFNLE9BQU8saUJBQWlCO0lBSTVCO1FBSFEsMkJBQXNCLEdBQUcsR0FBRyxDQUFDO1FBQzdCLG1CQUFjLEdBQUcsRUFBRSxDQUFDO0lBRVosQ0FBQztJQUVWLHNCQUFzQixDQUFDLEtBQWE7UUFDekMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztJQUN0QyxDQUFDO0lBRU0sc0JBQXNCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDO0lBQ3JDLENBQUM7SUFFTSxlQUFlLENBQUMsS0FBYTtRQUNsQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDO0lBRU0sZUFBZTtRQUNwQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7Ozs7Ozs7TUFTRTtJQUNLLFNBQVMsQ0FBQyxNQUFjLEVBQUUsSUFBYyxFQUFFLFdBQXFCO1FBQ3BFLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNyQixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQ2hDLE1BQU0sU0FBUyxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7WUFDN0QsS0FBSyxJQUFJLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFO29CQUNmLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDeEIsTUFBTTtpQkFDUDtnQkFDRCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDVDtZQUNELFdBQVcsRUFBRSxDQUFDO1lBQ2QsWUFBWSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztRQUM5QyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7OytHQTlDVSxpQkFBaUI7bUhBQWpCLGlCQUFpQixjQUZoQixNQUFNOzRGQUVQLGlCQUFpQjtrQkFIN0IsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIE1hc3RlckZvcm1TZXJ2aWNlIHtcbiAgcHJpdmF0ZSBJVEVNU19SRU5ERVJFRF9BVF9PTkNFID0gMTAwO1xuICBwcml2YXRlIElOVEVSVkFMX0lOX01TID0gMjA7XG5cbiAgY29uc3RydWN0b3IoKSB7IH1cblxuICBwdWJsaWMgc2V0SXRlbXNSZW5kZXJlZEF0T25jZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5JVEVNU19SRU5ERVJFRF9BVF9PTkNFID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0SXRlbXNSZW5kZXJlZEF0T25jZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLklURU1TX1JFTkRFUkVEX0FUX09OQ0U7XG4gIH1cblxuICBwdWJsaWMgc2V0SW50ZXJWYWxJbk1zKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLklOVEVSVkFMX0lOX01TID0gdmFsdWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0SW50ZXJWYWxJbk1zKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuSU5URVJWQUxfSU5fTVM7XG4gIH1cblxuICAvKlxuICAgIHRoaXMubWFzdGVyRm9ybVNlcnZpY2UuYnVpbGREYXRhKDUwMCwgKGkpID0+IHtcbiAgICAgIGxldCB0ID0geyAuLi5yZXN1bHQgfTtcbiAgICAgIHQubmFtZSA9IGkgKyAnLScgKyB0Lm5hbWU7XG4gICAgICB0LmRpc3BsYXkgPSBpICsgJy0nICsgdC5kaXNwbGF5O1xuICAgICAgdGhpcy5tYXN0ZXJGb3Jtcy5wdXNoKHQpO1xuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuanNvbkRhdGEubmV4dCh0aGlzLm1hc3RlckZvcm1zKTtcbiAgICB9KTtcbiAgKi9cbiAgcHVibGljIGJ1aWxkRGF0YShsZW5ndGg6IG51bWJlciwgZnVuYzogRnVuY3Rpb24sIGZ1bmNfcmVuZGVyOiBGdW5jdGlvbikge1xuICAgIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgbmV4dEluZGV4ID0gY3VycmVudEluZGV4ICsgdGhpcy5JVEVNU19SRU5ERVJFRF9BVF9PTkNFO1xuICAgICAgZm9yIChsZXQgbiA9IGN1cnJlbnRJbmRleDsgbiA8PSBuZXh0SW5kZXg7IG4rKykge1xuICAgICAgICBpZiAobiA+PSBsZW5ndGgpIHtcbiAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmdW5jKG4pO1xuICAgICAgfVxuICAgICAgZnVuY19yZW5kZXIoKTtcbiAgICAgIGN1cnJlbnRJbmRleCArPSB0aGlzLklURU1TX1JFTkRFUkVEX0FUX09OQ0U7XG4gICAgfSwgdGhpcy5JTlRFUlZBTF9JTl9NUyk7XG4gIH1cbn1cbiJdfQ==