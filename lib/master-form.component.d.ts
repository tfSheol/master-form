import { AfterContentInit, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, FormGroupDirective } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MasterFormHelperData } from './master-form.helper.interface';
import * as i0 from "@angular/core";
export declare enum MasterFormType {
    INPUT = 0,
    SELECT = 1,
    CHECKBOX = 2,
    TEXTAREA = 3,
    LABEL = 4
}
export declare interface MasterFormCustomField {
    sourceField: string;
    idField: string;
}
export declare interface MasterForm {
    name: string;
    display: string;
    placeholder?: string;
    controls?: ValidatorFn | ValidatorFn[];
    required?: boolean;
    type?: MasterFormType;
    inputType?: 'color' | 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';
    isMultiselect?: boolean;
    hasIcon?: boolean;
    icon?: string;
    hasFilter?: boolean;
    filterCtrl?: FormControl;
    filterPlaceholder?: string;
    filterNoEntries?: string;
    errorMessageFunction?: (formControl: FormControl) => string;
    onInput?: (formControl: FormControl, target: any) => void;
    minLength?: number;
    maxLength?: number;
    data?: () => Observable<any>;
    customDataField?: MasterFormCustomField;
    value?: any[];
    filteredValue?: any[];
}
export declare enum SubType {
    SYSTEM = 0,
    DEFAULT = 1
}
export declare interface Subs {
    type: SubType;
    subscription: Subscription;
}
export declare class MasterFormComponent implements OnDestroy, OnInit, AfterContentInit {
    private ref;
    static MAX_INPUT_VALUE: number;
    static MIN_INPUT_VALUE: number;
    private subscriptions;
    formGroup: FormGroup;
    observable?: Observable<MasterForm[]>;
    masterForms?: MasterForm[];
    data: any;
    autoValidate?: boolean;
    rendererItemsRenderedAtOnce?: number;
    rendererItemsIntervalInMs?: number;
    clear?: EventEmitter<void>;
    render?: EventEmitter<void>;
    reload?: EventEmitter<void>;
    onInit?: EventEmitter<MasterFormHelperData<any>>;
    onData?: EventEmitter<MasterFormHelperData<any>>;
    onValidate?: EventEmitter<boolean>;
    onError?: EventEmitter<any[]>;
    onObservableUpdate?: EventEmitter<MasterFormHelperData<any>>;
    container: ViewContainerRef;
    template: TemplateRef<any>;
    formDirective: FormGroupDirective;
    constructor(ref: ChangeDetectorRef);
    ngAfterContentInit(): void;
    private addInput;
    isLabel(masterForm: MasterForm): boolean;
    isInput(masterForm: MasterForm): boolean;
    isSelect(masterForm: MasterForm): boolean;
    isCheckbox(masterForm: MasterForm): boolean;
    isTextarea(masterForm: MasterForm): boolean;
    private selectPlaceholder;
    private autoAddInput;
    private renderItem;
    protected addSubscription(type: SubType, subscription: Subscription): void;
    private init;
    emitOnError(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    private filter;
    getItemsList(masterForm: MasterForm): any[];
    static ɵfac: i0.ɵɵFactoryDeclaration<MasterFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MasterFormComponent, "master-form", never, { "observable": "observable"; "masterForms": "forms"; "data": "data"; "autoValidate": "autoValidate"; "rendererItemsRenderedAtOnce": "rendererItemsRenderedAtOnce"; "rendererItemsIntervalInMs": "rendererItemsIntervalInMs"; "clear": "clear"; "render": "render"; "reload": "reload"; }, { "onInit": "onInit"; "onData": "onData"; "onValidate": "onValidate"; "onError": "onError"; "onObservableUpdate": "onObservableUpdate"; }, never, never>;
}
