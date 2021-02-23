import { FormGroup } from '@angular/forms';

export declare interface MasterFormHelperData<T> {
    data: any;
    form: FormGroup;
}

export declare interface MasterFormHelperInterface<T> {
    onInit(data: MasterFormHelperData<T>): void;
    validate(disabled: boolean): void;
    onData(data: MasterFormHelperData<T>): void;
    onError?(errors: any[]): void;
    onObservableUpdate?(data: MasterFormHelperData<T>): void;
}