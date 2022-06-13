import * as i0 from "@angular/core";
export declare class MasterFormService {
    private ITEMS_RENDERED_AT_ONCE;
    private INTERVAL_IN_MS;
    constructor();
    setItemsRenderedAtOnce(value: number): void;
    getItemsRenderedAtOnce(): number;
    setInterValInMs(value: number): void;
    getInterValInMs(): number;
    buildData(length: number, func: Function, func_render: Function): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MasterFormService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MasterFormService>;
}
