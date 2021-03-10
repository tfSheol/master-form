import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MasterFormHelperData } from './master-form.helper.interface';

export enum MasterFormType {
    INPUT,
    SELECT,
    CHECKBOX,
    TEXTAREA,
    LABEL
}

export declare interface MasterFormCustomField {
    sourceField: string,
    idField: string
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

export enum SubType {
    SYSTEM,
    DEFAULT
}

export declare interface Subs {
    type: SubType;
    subscription: Subscription
}

@Component({
    moduleId: module.id,
    selector: 'master-form',
    templateUrl: 'master-form.component.html',
    styleUrls: ['master-form.component.scss']
})
export class MasterFormComponent implements OnDestroy, OnInit, AfterContentInit {
    public static MAX_INPUT_VALUE: number = 500;
    public static MIN_INPUT_VALUE: number = 0;
    private subscriptions: Subs[] = [];
    public formGroup: FormGroup = new FormGroup({});

    @Input() observable?: Observable<MasterForm[]>;
    @Input('forms') masterForms?: MasterForm[] = [];
    @Input() data: any = <any>{};
    @Input() autoValidate?: boolean;

    @Input() clear?: EventEmitter<void> = new EventEmitter();
    @Input() render?: EventEmitter<void> = new EventEmitter();
    @Input() reload?: EventEmitter<void> = new EventEmitter();

    @Output() onInit?: EventEmitter<any> = new EventEmitter();
    @Output() onData?: EventEmitter<any> = new EventEmitter();
    @Output() onValidate?: EventEmitter<any> = new EventEmitter();
    @Output() onError?: EventEmitter<any> = new EventEmitter();
    @Output() onObservableUpdate?: EventEmitter<any> = new EventEmitter();

    @ViewChild('itemsContainer', { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild('item', { read: TemplateRef }) template: TemplateRef<any>;

    constructor() {
    }

    ngAfterContentInit() {
        this.addSubscription(SubType.SYSTEM, this.clear.subscribe(() => {
            this.masterForms = [];
            this.data = {};
            this.container.clear();
            this.subscriptions.filter(sub => sub.type == SubType.DEFAULT).forEach(subscription => {
                if (!subscription.subscription.closed) {
                    subscription.subscription.unsubscribe();
                }
            });
        }));
        this.addSubscription(SubType.SYSTEM, this.render.subscribe(() => this.renderItem()));
        this.addSubscription(SubType.SYSTEM, this.reload.subscribe(() => {
            this.container.clear();
            this.renderItem();
        }));
    }

    private addInput<T>(masterForm: MasterForm): MasterFormComponent {
        this.formGroup.addControl(masterForm.name, new FormControl('', masterForm.controls));
        return this;
    }

    public isLabel(masterForm: MasterForm): boolean {
        return masterForm.type === MasterFormType.LABEL;
    }

    public isInput(masterForm: MasterForm): boolean {
        return masterForm.type === MasterFormType.INPUT;
    }

    public isSelect(masterForm: MasterForm): boolean {
        return masterForm.type === MasterFormType.SELECT;
    }

    public isCheckbox(masterForm: MasterForm): boolean {
        return masterForm.type === MasterFormType.CHECKBOX;
    }

    public isTextarea(masterForm: MasterForm): boolean {
        return masterForm.type === MasterFormType.TEXTAREA;
    }

    private selectPlaceholder(masterForm: MasterForm): string {
        return !masterForm.placeholder ? masterForm.display : masterForm.placeholder;
    }

    private autoAddInput(masterForms: MasterForm[]) {
        masterForms.forEach((masterForm: MasterForm) => {
            if (!masterForm.type) {
                masterForm.type = MasterFormType.INPUT
            }
            if (!masterForm.onInput) {
                masterForm.onInput = (formControl: FormControl, target: any) => { };
            }
            if (!masterForm.maxLength) {
                masterForm.maxLength = MasterFormComponent.MAX_INPUT_VALUE;
            }
            if (!masterForm.minLength) {
                masterForm.minLength = MasterFormComponent.MIN_INPUT_VALUE;
            }
            if (masterForm.data) {
                this.addSubscription(SubType.DEFAULT, masterForm.data().subscribe(data => {
                    masterForm.value = data;
                    masterForm.filteredValue = data;
                }));
                if (masterForm.hasFilter) {
                    let filterCtrl = new FormControl();
                    this.addSubscription(SubType.DEFAULT, filterCtrl.valueChanges.subscribe(search => {
                        this.filter(masterForm, search);
                    }));
                    this.formGroup.addControl(masterForm.name + '_filter', filterCtrl);
                }
                let formControl = new FormControl('', masterForm.controls);
                this.formGroup.addControl(masterForm.name, formControl);
            } else if (masterForm.type === MasterFormType.CHECKBOX) {
                this.formGroup.addControl(masterForm.name, new FormControl(false));
            } else {
                this.formGroup.addControl(masterForm.name, new FormControl('', masterForm.controls));
            }
        });
    }

    private renderItem() {
        const ITEMS_RENDERED_AT_ONCE = 30;
        const INTERVAL_IN_MS = 20;

        let currentIndex = 0;

        const end = this.masterForms.length;
        console.log("start rendering...");

        const interval = setInterval(() => {
            const nextIndex = currentIndex + ITEMS_RENDERED_AT_ONCE;
            for (let n = currentIndex; n <= nextIndex; n++) {
                if (n >= end) {
                    clearInterval(interval);
                    break;
                }
                this.container.createEmbeddedView(this.template, {
                    masterForm: this.masterForms[n]
                });
            }
            currentIndex += ITEMS_RENDERED_AT_ONCE;
        }, INTERVAL_IN_MS);
    };

    protected addSubscription(type: SubType, subscription: Subscription) {
        this.subscriptions.push({
            type: type,
            subscription: subscription
        });
    }

    private init(masterForms: MasterForm[]) {
        this.autoAddInput(masterForms);
        this.addSubscription(SubType.DEFAULT, this.formGroup.valueChanges.subscribe(value => {
            Object.getOwnPropertyNames(value).forEach(val => {
                if (val.includes('_filter')) {
                    delete value[val];
                }
            });
            masterForms.forEach(el => {
                if (el.customDataField) {
                    let data = [...value[el.name]];
                    value[el.name] = [];
                    data?.forEach(element => {
                        let vl = el.value?.find(e => e[el.customDataField.sourceField] === element);
                        if (vl) {
                            value[el.name].push(vl[el.customDataField.idField]);
                        }
                    });
                }
            })
            this.onData.emit(<MasterFormHelperData<any>>{
                data: value,
                form: this.formGroup
            });
            this.onValidate.emit(!(this.formGroup.valid));
        }));
        if (this.data != null) {
            this.formGroup.patchValue(this.data);
            this.onInit.emit(<MasterFormHelperData<any>>{
                data: this.data,
                form: this.formGroup
            });
        }
        if (this.onError) {
            this.addSubscription(SubType.DEFAULT, this.formGroup.valueChanges.subscribe(() => {
                this.emitOnError();
            }));
        }
        this.renderItem();
    }

    emitOnError() {
        this.onError.emit(Object.keys(this.formGroup.controls).map(object => {
            return {
                'name': object,
                'erros': this.formGroup.controls[object].errors,
                'status': this.formGroup.controls[object].status,
                'isValid': this.formGroup.controls[object].status !== "INVALID"
            }
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            if (!subscription.subscription.closed) {
                subscription.subscription.unsubscribe();
            }
        });
    }

    ngOnInit(): void {
        if (this.observable) {
            this.addSubscription(SubType.SYSTEM, this.observable.subscribe(masterForms => {
                console.log("---> update", masterForms);
                this.masterForms = masterForms;
                this.init(masterForms);
                if (this.onObservableUpdate) {
                    this.onObservableUpdate.emit(<MasterFormHelperData<any>>{
                        data: this.data,
                        form: this.formGroup
                    });
                    this.emitOnError();
                }
            }));
        } else if (this.masterForms) {
            this.init(this.masterForms);
        }
    }

    private filter(masterForm: MasterForm, search: string) {
        if (!search) {
            masterForm.filteredValue = masterForm.value;
            return;
        } else {
            search = search.toLowerCase();
        }
        if (masterForm.customDataField) {
            masterForm.filteredValue = masterForm.value.filter(item => item[masterForm.customDataField.sourceField].toLowerCase().indexOf(search) > -1);
        } else {
            masterForm.filteredValue = masterForm.value.filter(item => item.toLowerCase().indexOf(search) > -1);
        }
    }

    public getItemsList(masterForm: MasterForm): any[] {
        if (masterForm.hasFilter) {
            return masterForm.filteredValue;
        }
        return masterForm.value;
    }
}
