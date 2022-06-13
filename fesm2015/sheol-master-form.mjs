import * as i0 from '@angular/core';
import { Injectable, EventEmitter, ViewContainerRef, TemplateRef, Component, ChangeDetectionStrategy, Input, Output, ViewChild, NgModule } from '@angular/core';
import * as i8 from '@angular/forms';
import { FormGroup, FormControl, FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i1 from '@angular/material/divider';
import { MatDividerModule } from '@angular/material/divider';
import * as i2 from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as i3 from '@angular/material/icon';
import { MatIconModule } from '@angular/material/icon';
import * as i4 from '@angular/material/select';
import { MatSelectModule } from '@angular/material/select';
import * as i5 from '@angular/material/core';
import * as i6 from 'ngx-mat-select-search';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import * as i7 from '@angular/material/checkbox';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as i9 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i10 from '@angular/material/chips';
import { MatChipsModule } from '@angular/material/chips';
import * as i11 from '@angular/material/input';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MasterFormService {
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

var MasterFormType;
(function (MasterFormType) {
    MasterFormType[MasterFormType["INPUT"] = 0] = "INPUT";
    MasterFormType[MasterFormType["SELECT"] = 1] = "SELECT";
    MasterFormType[MasterFormType["CHECKBOX"] = 2] = "CHECKBOX";
    MasterFormType[MasterFormType["TEXTAREA"] = 3] = "TEXTAREA";
    MasterFormType[MasterFormType["LABEL"] = 4] = "LABEL";
})(MasterFormType || (MasterFormType = {}));
var SubType;
(function (SubType) {
    SubType[SubType["SYSTEM"] = 0] = "SYSTEM";
    SubType[SubType["DEFAULT"] = 1] = "DEFAULT";
})(SubType || (SubType = {}));
class MasterFormComponent {
    constructor(ref) {
        this.ref = ref;
        this.subscriptions = [];
        this.formGroup = new FormGroup({});
        this.masterForms = [];
        this.data = {};
        this.rendererItemsRenderedAtOnce = 30;
        this.rendererItemsIntervalInMs = 20;
        this.clear = new EventEmitter();
        this.render = new EventEmitter();
        this.reload = new EventEmitter();
        this.onInit = new EventEmitter();
        this.onData = new EventEmitter();
        this.onValidate = new EventEmitter();
        this.onError = new EventEmitter();
        this.onObservableUpdate = new EventEmitter();
    }
    ngAfterContentInit() {
        this.addSubscription(SubType.SYSTEM, this.clear.subscribe(() => {
            this.masterForms = [];
            this.data = {};
            this.container.clear();
            this.formGroup.reset();
            this.formDirective.resetForm();
            this.onError.emit([]);
            this.onValidate.emit(false);
            this.onData.emit({
                data: [],
                form: {}
            });
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
    addInput(masterForm) {
        this.formGroup.addControl(masterForm.name, new FormControl('', masterForm.controls));
        return this;
    }
    isLabel(masterForm) {
        return masterForm.type === MasterFormType.LABEL;
    }
    isInput(masterForm) {
        return masterForm.type === MasterFormType.INPUT;
    }
    isSelect(masterForm) {
        return masterForm.type === MasterFormType.SELECT;
    }
    isCheckbox(masterForm) {
        return masterForm.type === MasterFormType.CHECKBOX;
    }
    isTextarea(masterForm) {
        return masterForm.type === MasterFormType.TEXTAREA;
    }
    selectPlaceholder(masterForm) {
        return !masterForm.placeholder ? masterForm.display : masterForm.placeholder;
    }
    autoAddInput(masterForms) {
        masterForms.forEach((masterForm) => {
            if (!masterForm.type) {
                masterForm.type = MasterFormType.INPUT;
            }
            if (!masterForm.onInput) {
                masterForm.onInput = (formControl, target) => { };
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
            }
            else if (masterForm.type === MasterFormType.CHECKBOX) {
                this.formGroup.addControl(masterForm.name, new FormControl(false));
            }
            else {
                this.formGroup.addControl(masterForm.name, new FormControl('', masterForm.controls));
            }
        });
    }
    renderItem() {
        const ITEMS_RENDERED_AT_ONCE = this.rendererItemsRenderedAtOnce;
        const INTERVAL_IN_MS = this.rendererItemsIntervalInMs;
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
            this.ref.detectChanges();
            currentIndex += ITEMS_RENDERED_AT_ONCE;
        }, INTERVAL_IN_MS);
    }
    ;
    addSubscription(type, subscription) {
        this.subscriptions.push({
            type: type,
            subscription: subscription
        });
    }
    init(masterForms) {
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
                    data === null || data === void 0 ? void 0 : data.forEach(element => {
                        var _a;
                        let vl = (_a = el.value) === null || _a === void 0 ? void 0 : _a.find(e => e[el.customDataField.sourceField] === element);
                        if (vl) {
                            value[el.name].push(vl[el.customDataField.idField]);
                        }
                    });
                }
            });
            this.onData.emit({
                data: value,
                form: this.formGroup
            });
            this.onValidate.emit(!(this.formGroup.valid));
        }));
        if (this.data != null) {
            this.formGroup.patchValue(this.data);
            this.onInit.emit({
                data: this.data,
                form: this.formGroup
            });
        }
        this.renderItem();
        if (this.onError) {
            if (this.formGroup.errors !== null) {
                this.emitOnError();
            }
        }
    }
    emitOnError() {
        this.onError.emit(Object.keys(this.formGroup.controls)
            .filter(key => this.formGroup.controls[key].status === "INVALID")
            .map(object => {
            return {
                'name': object,
                'erros': this.formGroup.controls[object].errors,
                'status': this.formGroup.controls[object].status,
                'isValid': this.formGroup.controls[object].status !== "INVALID"
            };
        }));
    }
    ngOnDestroy() {
        console.log('destroy');
        this.subscriptions.forEach(subscription => {
            if (!subscription.subscription.closed) {
                subscription.subscription.unsubscribe();
            }
        });
    }
    ngOnInit() {
        if (this.observable) {
            this.addSubscription(SubType.SYSTEM, this.observable.subscribe(masterForms => {
                this.masterForms = masterForms;
                this.init(masterForms);
                if (this.onObservableUpdate) {
                    this.onObservableUpdate.emit({
                        data: this.data,
                        form: this.formGroup
                    });
                    this.emitOnError();
                }
            }));
        }
        else if (this.masterForms) {
            this.init(this.masterForms);
        }
    }
    filter(masterForm, search) {
        if (!search) {
            masterForm.filteredValue = masterForm.value;
            return;
        }
        else {
            search = search.toLowerCase();
        }
        if (masterForm.customDataField) {
            masterForm.filteredValue = masterForm.value.filter(item => item[masterForm.customDataField.sourceField].toLowerCase().indexOf(search) > -1);
        }
        else {
            masterForm.filteredValue = masterForm.value.filter(item => item.toLowerCase().indexOf(search) > -1);
        }
    }
    getItemsList(masterForm) {
        if (masterForm.hasFilter) {
            return masterForm.filteredValue;
        }
        return masterForm.value;
    }
}
MasterFormComponent.MAX_INPUT_VALUE = 500;
MasterFormComponent.MIN_INPUT_VALUE = 0;
MasterFormComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
MasterFormComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: MasterFormComponent, selector: "master-form", inputs: { observable: "observable", masterForms: ["forms", "masterForms"], data: "data", autoValidate: "autoValidate", rendererItemsRenderedAtOnce: "rendererItemsRenderedAtOnce", rendererItemsIntervalInMs: "rendererItemsIntervalInMs", clear: "clear", render: "render", reload: "reload" }, outputs: { onInit: "onInit", onData: "onData", onValidate: "onValidate", onError: "onError", onObservableUpdate: "onObservableUpdate" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["itemsContainer"], descendants: true, read: ViewContainerRef }, { propertyName: "template", first: true, predicate: ["item"], descendants: true, read: TemplateRef }, { propertyName: "formDirective", first: true, predicate: FormGroupDirective, descendants: true }], ngImport: i0, template: "<div>\n    <ng-container #itemsContainer></ng-container>\n<div>\n<form [formGroup]=\"formGroup\" #formDirective=\"ngForm\">\n    <!-- <div *ngFor=\"let masterForm of masterForms\"> -->\n    <ng-template #item let-masterForm=\"masterForm\">\n        <mat-chip color=\"primary\" selected *ngIf=\"formGroup.controls[masterForm.name] && isLabel(masterForm)\">{{masterForm.display}}</mat-chip>\n        <mat-divider *ngIf=\"formGroup.controls[masterForm.name] && isLabel(masterForm)\"></mat-divider>\n        <mat-form-field *ngIf=\"formGroup.controls[masterForm.name] && isInput(masterForm)\" appearance=\"fill\"\n            class=\"register-input\">\n            <mat-label>{{masterForm.display}}</mat-label>\n            <input [formControlName]=\"masterForm.name\" [type]=\"masterForm.inputType\" matInput [placeholder]=\"masterForm.placeholder\" \n            (input)=\"masterForm.onInput(formGroup.controls[masterForm.name], $event.target)\" \n            [minLength]=\"masterForm.minLength\" [maxLength]=\"masterForm.maxLength\" [required]=\"masterForm.required\">\n            <mat-error *ngIf=\"masterForm.errorMessageFunction && formGroup.controls[masterForm.name].invalid\">\n                {{masterForm.errorMessageFunction(formGroup.controls[masterForm.name])}}\n            </mat-error>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </mat-form-field>\n        <mat-form-field *ngIf=\"formGroup.controls[masterForm.name] && isSelect(masterForm)\">\n            <mat-select [formControlName]=\"masterForm.name\" [placeholder]=\"selectPlaceholder(masterForm)\"\n                [multiple]=masterForm.isMultiselect [required]=\"masterForm.required\">\n                <mat-option *ngIf=\"masterForm.hasFilter\">\n                    <ngx-mat-select-search [formControlName]=\"masterForm.name + '_filter'\"\n                        [placeholderLabel]=\"masterForm.filterPlaceholder\"\n                        [noEntriesFoundLabel]=\"masterForm.filterNoEntries\"></ngx-mat-select-search>\n                </mat-option>\n                <mat-option *ngIf=\"!masterForm.required\" value=\"null\">Aucun</mat-option> <!-- todo: change condition & value-->\n                <ng-container *ngFor=\"let value of getItemsList(masterForm)\">\n                    <mat-option *ngIf=\"!masterForm.customDataField\" [value]=\"value\">{{ value }}</mat-option>\n                    <mat-option *ngIf=\"masterForm.customDataField\" [value]=\"value[masterForm.customDataField.sourceField]\">{{ value[masterForm.customDataField.sourceField] }}</mat-option>\n                </ng-container>\n            </mat-select>\n            <mat-error *ngIf=\"masterForm.errorMessageFunction && formGroup.controls[masterForm.name].invalid\">\n                {{masterForm.errorMessageFunction(formGroup.controls[masterForm.name])}}\n            </mat-error>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </mat-form-field>\n        <div *ngIf=\"formGroup.controls[masterForm.name] && isCheckbox(masterForm)\" class=\"add-bottom-padding\">\n            <mat-checkbox [formControlName]=\"masterForm.name\" [required]=required>{{masterForm.display}}</mat-checkbox>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </div>\n        <mat-form-field *ngIf=\"formGroup.controls[masterForm.name] && isTextarea(masterForm)\" appearance=\"fill\"\n            class=\"register-input\">\n            <mat-label>{{masterForm.display}}</mat-label>\n            <textarea [formControlName]=\"masterForm.name\" matInput [placeholder]=\"masterForm.placeholder\" [required]=\"masterForm.required\"></textarea>\n            <mat-error *ngIf=\"masterForm.errorMessageFunction && formGroup.controls[masterForm.name].invalid\">\n                {{masterForm.errorMessageFunction(formGroup.controls[masterForm.name])}}\n            </mat-error>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </mat-form-field>\n    </ng-template>\n    <!-- </div> -->\n</form>", styles: [".mat-form-field{font-size:14px;width:100%}.register-action{text-align:right}.register-input{width:100%}\n"], components: [{ type: i1.MatDivider, selector: "mat-divider", inputs: ["vertical", "inset"] }, { type: i2.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { type: i3.MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { type: i4.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { type: i5.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { type: i6.MatSelectSearchComponent, selector: "ngx-mat-select-search", inputs: ["placeholderLabel", "type", "noEntriesFoundLabel", "indexAndLengthScreenReaderText", "clearSearchInput", "searching", "disableInitialFocus", "enableClearOnEscapePressed", "preventHomeEndKeyPropagation", "disableScrollToActiveOnOptionsChanged", "ariaLabel", "showToggleAllCheckbox", "toggleAllCheckboxChecked", "toggleAllCheckboxIndeterminate", "toggleAllCheckboxTooltipMessage", "toogleAllCheckboxTooltipPosition"], outputs: ["toggleAll"] }, { type: i7.MatCheckbox, selector: "mat-checkbox", inputs: ["disableRipple", "color", "tabIndex", "aria-label", "aria-labelledby", "aria-describedby", "id", "required", "labelPosition", "name", "value", "checked", "disabled", "indeterminate"], outputs: ["change", "indeterminateChange"], exportAs: ["matCheckbox"] }], directives: [{ type: i8.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { type: i8.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { type: i8.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { type: i9.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i10.MatChip, selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]", inputs: ["color", "disableRipple", "tabIndex", "selected", "value", "selectable", "disabled", "removable"], outputs: ["selectionChange", "destroyed", "removed"], exportAs: ["matChip"] }, { type: i2.MatLabel, selector: "mat-label" }, { type: i11.MatInput, selector: "input[matInput], textarea[matInput], select[matNativeControl],      input[matNativeControl], textarea[matNativeControl]", inputs: ["disabled", "id", "placeholder", "name", "required", "type", "errorStateMatcher", "aria-describedby", "value", "readonly"], exportAs: ["matInput"] }, { type: i8.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { type: i8.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { type: i8.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { type: i8.RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: ["required"] }, { type: i2.MatError, selector: "mat-error", inputs: ["id"] }, { type: i2.MatSuffix, selector: "[matSuffix]" }, { type: i9.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i7.MatCheckboxRequiredValidator, selector: "mat-checkbox[required][formControlName],             mat-checkbox[required][formControl], mat-checkbox[required][ngModel]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormComponent, decorators: [{
            type: Component,
            args: [{ moduleId: module.id, selector: 'master-form', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div>\n    <ng-container #itemsContainer></ng-container>\n<div>\n<form [formGroup]=\"formGroup\" #formDirective=\"ngForm\">\n    <!-- <div *ngFor=\"let masterForm of masterForms\"> -->\n    <ng-template #item let-masterForm=\"masterForm\">\n        <mat-chip color=\"primary\" selected *ngIf=\"formGroup.controls[masterForm.name] && isLabel(masterForm)\">{{masterForm.display}}</mat-chip>\n        <mat-divider *ngIf=\"formGroup.controls[masterForm.name] && isLabel(masterForm)\"></mat-divider>\n        <mat-form-field *ngIf=\"formGroup.controls[masterForm.name] && isInput(masterForm)\" appearance=\"fill\"\n            class=\"register-input\">\n            <mat-label>{{masterForm.display}}</mat-label>\n            <input [formControlName]=\"masterForm.name\" [type]=\"masterForm.inputType\" matInput [placeholder]=\"masterForm.placeholder\" \n            (input)=\"masterForm.onInput(formGroup.controls[masterForm.name], $event.target)\" \n            [minLength]=\"masterForm.minLength\" [maxLength]=\"masterForm.maxLength\" [required]=\"masterForm.required\">\n            <mat-error *ngIf=\"masterForm.errorMessageFunction && formGroup.controls[masterForm.name].invalid\">\n                {{masterForm.errorMessageFunction(formGroup.controls[masterForm.name])}}\n            </mat-error>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </mat-form-field>\n        <mat-form-field *ngIf=\"formGroup.controls[masterForm.name] && isSelect(masterForm)\">\n            <mat-select [formControlName]=\"masterForm.name\" [placeholder]=\"selectPlaceholder(masterForm)\"\n                [multiple]=masterForm.isMultiselect [required]=\"masterForm.required\">\n                <mat-option *ngIf=\"masterForm.hasFilter\">\n                    <ngx-mat-select-search [formControlName]=\"masterForm.name + '_filter'\"\n                        [placeholderLabel]=\"masterForm.filterPlaceholder\"\n                        [noEntriesFoundLabel]=\"masterForm.filterNoEntries\"></ngx-mat-select-search>\n                </mat-option>\n                <mat-option *ngIf=\"!masterForm.required\" value=\"null\">Aucun</mat-option> <!-- todo: change condition & value-->\n                <ng-container *ngFor=\"let value of getItemsList(masterForm)\">\n                    <mat-option *ngIf=\"!masterForm.customDataField\" [value]=\"value\">{{ value }}</mat-option>\n                    <mat-option *ngIf=\"masterForm.customDataField\" [value]=\"value[masterForm.customDataField.sourceField]\">{{ value[masterForm.customDataField.sourceField] }}</mat-option>\n                </ng-container>\n            </mat-select>\n            <mat-error *ngIf=\"masterForm.errorMessageFunction && formGroup.controls[masterForm.name].invalid\">\n                {{masterForm.errorMessageFunction(formGroup.controls[masterForm.name])}}\n            </mat-error>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </mat-form-field>\n        <div *ngIf=\"formGroup.controls[masterForm.name] && isCheckbox(masterForm)\" class=\"add-bottom-padding\">\n            <mat-checkbox [formControlName]=\"masterForm.name\" [required]=required>{{masterForm.display}}</mat-checkbox>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </div>\n        <mat-form-field *ngIf=\"formGroup.controls[masterForm.name] && isTextarea(masterForm)\" appearance=\"fill\"\n            class=\"register-input\">\n            <mat-label>{{masterForm.display}}</mat-label>\n            <textarea [formControlName]=\"masterForm.name\" matInput [placeholder]=\"masterForm.placeholder\" [required]=\"masterForm.required\"></textarea>\n            <mat-error *ngIf=\"masterForm.errorMessageFunction && formGroup.controls[masterForm.name].invalid\">\n                {{masterForm.errorMessageFunction(formGroup.controls[masterForm.name])}}\n            </mat-error>\n            <mat-icon *ngIf=\"masterForm.hasIcon\" matSuffix>{{masterForm.icon}}</mat-icon>\n        </mat-form-field>\n    </ng-template>\n    <!-- </div> -->\n</form>", styles: [".mat-form-field{font-size:14px;width:100%}.register-action{text-align:right}.register-input{width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { observable: [{
                type: Input
            }], masterForms: [{
                type: Input,
                args: ['forms']
            }], data: [{
                type: Input
            }], autoValidate: [{
                type: Input
            }], rendererItemsRenderedAtOnce: [{
                type: Input
            }], rendererItemsIntervalInMs: [{
                type: Input
            }], clear: [{
                type: Input
            }], render: [{
                type: Input
            }], reload: [{
                type: Input
            }], onInit: [{
                type: Output
            }], onData: [{
                type: Output
            }], onValidate: [{
                type: Output
            }], onError: [{
                type: Output
            }], onObservableUpdate: [{
                type: Output
            }], container: [{
                type: ViewChild,
                args: ['itemsContainer', { read: ViewContainerRef }]
            }], template: [{
                type: ViewChild,
                args: ['item', { read: TemplateRef }]
            }], formDirective: [{
                type: ViewChild,
                args: [FormGroupDirective]
            }] } });

class MasterFormModule {
}
MasterFormModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MasterFormModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormModule, declarations: [MasterFormComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDividerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FlexLayoutModule,
        MatSelectModule,
        MatSnackBarModule,
        MatCheckboxModule,
        MatChipsModule,
        NgxMatSelectSearchModule], exports: [MasterFormComponent] });
MasterFormModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormModule, imports: [[
            BrowserModule,
            BrowserAnimationsModule,
            CommonModule,
            FormsModule,
            MatButtonModule,
            MatDividerModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            FlexLayoutModule,
            MatSelectModule,
            MatSnackBarModule,
            MatCheckboxModule,
            MatChipsModule,
            NgxMatSelectSearchModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: MasterFormModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        BrowserModule,
                        BrowserAnimationsModule,
                        CommonModule,
                        FormsModule,
                        MatButtonModule,
                        MatDividerModule,
                        ReactiveFormsModule,
                        MatFormFieldModule,
                        MatInputModule,
                        MatIconModule,
                        FlexLayoutModule,
                        MatSelectModule,
                        MatSnackBarModule,
                        MatCheckboxModule,
                        MatChipsModule,
                        NgxMatSelectSearchModule
                    ],
                    declarations: [
                        MasterFormComponent
                    ],
                    exports: [
                        MasterFormComponent,
                    ]
                }]
        }] });

/*
 * Public API Surface of master-form
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MasterFormComponent, MasterFormModule, MasterFormService, MasterFormType, SubType };
//# sourceMappingURL=sheol-master-form.mjs.map
