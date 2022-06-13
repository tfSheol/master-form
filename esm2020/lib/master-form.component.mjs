import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "@angular/material/divider";
import * as i2 from "@angular/material/form-field";
import * as i3 from "@angular/material/icon";
import * as i4 from "@angular/material/select";
import * as i5 from "@angular/material/core";
import * as i6 from "ngx-mat-select-search";
import * as i7 from "@angular/material/checkbox";
import * as i8 from "@angular/forms";
import * as i9 from "@angular/common";
import * as i10 from "@angular/material/chips";
import * as i11 from "@angular/material/input";
export var MasterFormType;
(function (MasterFormType) {
    MasterFormType[MasterFormType["INPUT"] = 0] = "INPUT";
    MasterFormType[MasterFormType["SELECT"] = 1] = "SELECT";
    MasterFormType[MasterFormType["CHECKBOX"] = 2] = "CHECKBOX";
    MasterFormType[MasterFormType["TEXTAREA"] = 3] = "TEXTAREA";
    MasterFormType[MasterFormType["LABEL"] = 4] = "LABEL";
})(MasterFormType || (MasterFormType = {}));
export var SubType;
(function (SubType) {
    SubType[SubType["SYSTEM"] = 0] = "SYSTEM";
    SubType[SubType["DEFAULT"] = 1] = "DEFAULT";
})(SubType || (SubType = {}));
export class MasterFormComponent {
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
                    data?.forEach(element => {
                        let vl = el.value?.find(e => e[el.customDataField.sourceField] === element);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLWZvcm0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbWFzdGVyLWZvcm0vc3JjL2xpYi9tYXN0ZXItZm9ybS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXN0ZXItZm9ybS9zcmMvbGliL21hc3Rlci1mb3JtLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0IsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLHVCQUF1QixFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUNsTSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBZSxrQkFBa0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7Ozs7O0FBSXpGLE1BQU0sQ0FBTixJQUFZLGNBTVg7QUFORCxXQUFZLGNBQWM7SUFDdEIscURBQUssQ0FBQTtJQUNMLHVEQUFNLENBQUE7SUFDTiwyREFBUSxDQUFBO0lBQ1IsMkRBQVEsQ0FBQTtJQUNSLHFEQUFLLENBQUE7QUFDVCxDQUFDLEVBTlcsY0FBYyxLQUFkLGNBQWMsUUFNekI7QUFnQ0QsTUFBTSxDQUFOLElBQVksT0FHWDtBQUhELFdBQVksT0FBTztJQUNmLHlDQUFNLENBQUE7SUFDTiwyQ0FBTyxDQUFBO0FBQ1gsQ0FBQyxFQUhXLE9BQU8sS0FBUCxPQUFPLFFBR2xCO0FBY0QsTUFBTSxPQUFPLG1CQUFtQjtJQTRCNUIsWUFBb0IsR0FBc0I7UUFBdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUF6QmxDLGtCQUFhLEdBQVcsRUFBRSxDQUFDO1FBQzVCLGNBQVMsR0FBYyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUdoQyxnQkFBVyxHQUFrQixFQUFFLENBQUM7UUFDdkMsU0FBSSxHQUFhLEVBQUUsQ0FBQztRQUdwQixn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d0dBVXRDLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ1UsV0FBVztzQkFBMUIsS0FBSzt1QkFBQyxPQUFPO2dCQUNMLElBQUk7c0JBQVosS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVHLDJCQUEyQjtzQkFBbkMsS0FBSztnQkFDRyx5QkFBeUI7c0JBQWpDLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUksTUFBTTtzQkFBZixNQUFNO2dCQUNHLE1BQU07c0JBQWYsTUFBTTtnQkFDRyxVQUFVO3NCQUFuQixNQUFNO2dCQUNHLE9BQU87c0JBQWhCLE1BQU07Z0JBQ0csa0JBQWtCO3NCQUEzQixNQUFNO2dCQUVrRCxTQUFTO3NCQUFqRSxTQUFTO3VCQUFDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUNiLFFBQVE7c0JBQWpELFNBQVM7dUJBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtnQkFDVCxhQUFhO3NCQUEzQyxTQUFTO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDaGlsZCwgVmlld0NvbnRhaW5lclJlZiwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBWYWxpZGF0b3JGbiwgRm9ybUdyb3VwRGlyZWN0aXZlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTWFzdGVyRm9ybUhlbHBlckRhdGEgfSBmcm9tICcuL21hc3Rlci1mb3JtLmhlbHBlci5pbnRlcmZhY2UnO1xuXG5leHBvcnQgZW51bSBNYXN0ZXJGb3JtVHlwZSB7XG4gICAgSU5QVVQsXG4gICAgU0VMRUNULFxuICAgIENIRUNLQk9YLFxuICAgIFRFWFRBUkVBLFxuICAgIExBQkVMXG59XG5cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBNYXN0ZXJGb3JtQ3VzdG9tRmllbGQge1xuICAgIHNvdXJjZUZpZWxkOiBzdHJpbmcsXG4gICAgaWRGaWVsZDogc3RyaW5nXG59XG5cbmV4cG9ydCBkZWNsYXJlIGludGVyZmFjZSBNYXN0ZXJGb3JtIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZGlzcGxheTogc3RyaW5nO1xuICAgIHBsYWNlaG9sZGVyPzogc3RyaW5nO1xuICAgIGNvbnRyb2xzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdO1xuICAgIHJlcXVpcmVkPzogYm9vbGVhbjtcbiAgICB0eXBlPzogTWFzdGVyRm9ybVR5cGU7XG4gICAgaW5wdXRUeXBlPzogJ2NvbG9yJyB8ICdkYXRlJyB8ICdkYXRldGltZS1sb2NhbCcgfCAnZW1haWwnIHwgJ21vbnRoJyB8ICdudW1iZXInIHwgJ3Bhc3N3b3JkJyB8ICdzZWFyY2gnIHwgJ3RlbCcgfCAndGV4dCcgfCAndGltZScgfCAndXJsJyB8ICd3ZWVrJztcbiAgICBpc011bHRpc2VsZWN0PzogYm9vbGVhbjtcbiAgICBoYXNJY29uPzogYm9vbGVhbjtcbiAgICBpY29uPzogc3RyaW5nO1xuICAgIGhhc0ZpbHRlcj86IGJvb2xlYW47XG4gICAgZmlsdGVyQ3RybD86IEZvcm1Db250cm9sO1xuICAgIGZpbHRlclBsYWNlaG9sZGVyPzogc3RyaW5nO1xuICAgIGZpbHRlck5vRW50cmllcz86IHN0cmluZztcbiAgICBlcnJvck1lc3NhZ2VGdW5jdGlvbj86IChmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wpID0+IHN0cmluZztcbiAgICBvbklucHV0PzogKGZvcm1Db250cm9sOiBGb3JtQ29udHJvbCwgdGFyZ2V0OiBhbnkpID0+IHZvaWQ7XG4gICAgbWluTGVuZ3RoPzogbnVtYmVyO1xuICAgIG1heExlbmd0aD86IG51bWJlcjtcbiAgICBkYXRhPzogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xuICAgIGN1c3RvbURhdGFGaWVsZD86IE1hc3RlckZvcm1DdXN0b21GaWVsZDtcbiAgICB2YWx1ZT86IGFueVtdO1xuICAgIGZpbHRlcmVkVmFsdWU/OiBhbnlbXTtcbn1cblxuZXhwb3J0IGVudW0gU3ViVHlwZSB7XG4gICAgU1lTVEVNLFxuICAgIERFRkFVTFRcbn1cblxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIFN1YnMge1xuICAgIHR5cGU6IFN1YlR5cGU7XG4gICAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb25cbn1cblxuQENvbXBvbmVudCh7XG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICBzZWxlY3RvcjogJ21hc3Rlci1mb3JtJyxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICB0ZW1wbGF0ZVVybDogJ21hc3Rlci1mb3JtLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnbWFzdGVyLWZvcm0uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNYXN0ZXJGb3JtQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQge1xuICAgIHB1YmxpYyBzdGF0aWMgTUFYX0lOUFVUX1ZBTFVFOiBudW1iZXIgPSA1MDA7XG4gICAgcHVibGljIHN0YXRpYyBNSU5fSU5QVVRfVkFMVUU6IG51bWJlciA9IDA7XG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzW10gPSBbXTtcbiAgICBwdWJsaWMgZm9ybUdyb3VwOiBGb3JtR3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcblxuICAgIEBJbnB1dCgpIG9ic2VydmFibGU/OiBPYnNlcnZhYmxlPE1hc3RlckZvcm1bXT47XG4gICAgQElucHV0KCdmb3JtcycpIG1hc3RlckZvcm1zPzogTWFzdGVyRm9ybVtdID0gW107XG4gICAgQElucHV0KCkgZGF0YTogYW55ID0gPGFueT57fTtcbiAgICBASW5wdXQoKSBhdXRvVmFsaWRhdGU/OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcmVuZGVyZXJJdGVtc1JlbmRlcmVkQXRPbmNlPzogbnVtYmVyID0gMzA7XG4gICAgQElucHV0KCkgcmVuZGVyZXJJdGVtc0ludGVydmFsSW5Ncz86IG51bWJlciA9IDIwO1xuXG4gICAgQElucHV0KCkgY2xlYXI/OiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQElucHV0KCkgcmVuZGVyPzogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIEBJbnB1dCgpIHJlbG9hZD86IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkluaXQ/OiBFdmVudEVtaXR0ZXI8TWFzdGVyRm9ybUhlbHBlckRhdGE8YW55Pj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIG9uRGF0YT86IEV2ZW50RW1pdHRlcjxNYXN0ZXJGb3JtSGVscGVyRGF0YTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCkgb25WYWxpZGF0ZT86IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBAT3V0cHV0KCkgb25FcnJvcj86IEV2ZW50RW1pdHRlcjxhbnlbXT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQE91dHB1dCgpIG9uT2JzZXJ2YWJsZVVwZGF0ZT86IEV2ZW50RW1pdHRlcjxNYXN0ZXJGb3JtSGVscGVyRGF0YTxhbnk+PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2l0ZW1zQ29udGFpbmVyJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmIH0pIGNvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZjtcbiAgICBAVmlld0NoaWxkKCdpdGVtJywgeyByZWFkOiBUZW1wbGF0ZVJlZiB9KSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBAVmlld0NoaWxkKEZvcm1Hcm91cERpcmVjdGl2ZSkgZm9ybURpcmVjdGl2ZTogRm9ybUdyb3VwRGlyZWN0aXZlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLmFkZFN1YnNjcmlwdGlvbihTdWJUeXBlLlNZU1RFTSwgdGhpcy5jbGVhci5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tYXN0ZXJGb3JtcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5kYXRhID0ge307XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5yZXNldEZvcm0oKTtcbiAgICAgICAgICAgIHRoaXMub25FcnJvci5lbWl0KFtdKTtcbiAgICAgICAgICAgIHRoaXMub25WYWxpZGF0ZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMub25EYXRhLmVtaXQoe1xuICAgICAgICAgICAgICAgIGRhdGE6IFtdLFxuICAgICAgICAgICAgICAgIGZvcm06IDxGb3JtR3JvdXA+e31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmZpbHRlcihzdWIgPT4gc3ViLnR5cGUgPT0gU3ViVHlwZS5ERUZBVUxUKS5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFzdWJzY3JpcHRpb24uc3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgdGhpcy5hZGRTdWJzY3JpcHRpb24oU3ViVHlwZS5TWVNURU0sIHRoaXMucmVuZGVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLnJlbmRlckl0ZW0oKSkpO1xuICAgICAgICB0aGlzLmFkZFN1YnNjcmlwdGlvbihTdWJUeXBlLlNZU1RFTSwgdGhpcy5yZWxvYWQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckl0ZW0oKTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkSW5wdXQ8VD4obWFzdGVyRm9ybTogTWFzdGVyRm9ybSk6IE1hc3RlckZvcm1Db21wb25lbnQge1xuICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKG1hc3RlckZvcm0ubmFtZSwgbmV3IEZvcm1Db250cm9sKCcnLCBtYXN0ZXJGb3JtLmNvbnRyb2xzKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0xhYmVsKG1hc3RlckZvcm06IE1hc3RlckZvcm0pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIG1hc3RlckZvcm0udHlwZSA9PT0gTWFzdGVyRm9ybVR5cGUuTEFCRUw7XG4gICAgfVxuXG4gICAgcHVibGljIGlzSW5wdXQobWFzdGVyRm9ybTogTWFzdGVyRm9ybSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbWFzdGVyRm9ybS50eXBlID09PSBNYXN0ZXJGb3JtVHlwZS5JTlBVVDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNTZWxlY3QobWFzdGVyRm9ybTogTWFzdGVyRm9ybSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbWFzdGVyRm9ybS50eXBlID09PSBNYXN0ZXJGb3JtVHlwZS5TRUxFQ1Q7XG4gICAgfVxuXG4gICAgcHVibGljIGlzQ2hlY2tib3gobWFzdGVyRm9ybTogTWFzdGVyRm9ybSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gbWFzdGVyRm9ybS50eXBlID09PSBNYXN0ZXJGb3JtVHlwZS5DSEVDS0JPWDtcbiAgICB9XG5cbiAgICBwdWJsaWMgaXNUZXh0YXJlYShtYXN0ZXJGb3JtOiBNYXN0ZXJGb3JtKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBtYXN0ZXJGb3JtLnR5cGUgPT09IE1hc3RlckZvcm1UeXBlLlRFWFRBUkVBO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2VsZWN0UGxhY2Vob2xkZXIobWFzdGVyRm9ybTogTWFzdGVyRm9ybSk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAhbWFzdGVyRm9ybS5wbGFjZWhvbGRlciA/IG1hc3RlckZvcm0uZGlzcGxheSA6IG1hc3RlckZvcm0ucGxhY2Vob2xkZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXRvQWRkSW5wdXQobWFzdGVyRm9ybXM6IE1hc3RlckZvcm1bXSkge1xuICAgICAgICBtYXN0ZXJGb3Jtcy5mb3JFYWNoKChtYXN0ZXJGb3JtOiBNYXN0ZXJGb3JtKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW1hc3RlckZvcm0udHlwZSkge1xuICAgICAgICAgICAgICAgIG1hc3RlckZvcm0udHlwZSA9IE1hc3RlckZvcm1UeXBlLklOUFVUXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW1hc3RlckZvcm0ub25JbnB1dCkge1xuICAgICAgICAgICAgICAgIG1hc3RlckZvcm0ub25JbnB1dCA9IChmb3JtQ29udHJvbDogRm9ybUNvbnRyb2wsIHRhcmdldDogYW55KSA9PiB7IH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW1hc3RlckZvcm0ubWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbWFzdGVyRm9ybS5tYXhMZW5ndGggPSBNYXN0ZXJGb3JtQ29tcG9uZW50Lk1BWF9JTlBVVF9WQUxVRTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbWFzdGVyRm9ybS5taW5MZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBtYXN0ZXJGb3JtLm1pbkxlbmd0aCA9IE1hc3RlckZvcm1Db21wb25lbnQuTUlOX0lOUFVUX1ZBTFVFO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1hc3RlckZvcm0uZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkU3Vic2NyaXB0aW9uKFN1YlR5cGUuREVGQVVMVCwgbWFzdGVyRm9ybS5kYXRhKCkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBtYXN0ZXJGb3JtLnZhbHVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgbWFzdGVyRm9ybS5maWx0ZXJlZFZhbHVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hc3RlckZvcm0uaGFzRmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJDdHJsID0gbmV3IEZvcm1Db250cm9sKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkU3Vic2NyaXB0aW9uKFN1YlR5cGUuREVGQVVMVCwgZmlsdGVyQ3RybC52YWx1ZUNoYW5nZXMuc3Vic2NyaWJlKHNlYXJjaCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbHRlcihtYXN0ZXJGb3JtLCBzZWFyY2gpO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLmFkZENvbnRyb2wobWFzdGVyRm9ybS5uYW1lICsgJ19maWx0ZXInLCBmaWx0ZXJDdHJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCBtYXN0ZXJGb3JtLmNvbnRyb2xzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKG1hc3RlckZvcm0ubmFtZSwgZm9ybUNvbnRyb2wpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChtYXN0ZXJGb3JtLnR5cGUgPT09IE1hc3RlckZvcm1UeXBlLkNIRUNLQk9YKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3JtR3JvdXAuYWRkQ29udHJvbChtYXN0ZXJGb3JtLm5hbWUsIG5ldyBGb3JtQ29udHJvbChmYWxzZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcm1Hcm91cC5hZGRDb250cm9sKG1hc3RlckZvcm0ubmFtZSwgbmV3IEZvcm1Db250cm9sKCcnLCBtYXN0ZXJGb3JtLmNvbnRyb2xzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVySXRlbSgpIHtcbiAgICAgICAgY29uc3QgSVRFTVNfUkVOREVSRURfQVRfT05DRSA9IHRoaXMucmVuZGVyZXJJdGVtc1JlbmRlcmVkQXRPbmNlXG4gICAgICAgIGNvbnN0IElOVEVSVkFMX0lOX01TID0gdGhpcy5yZW5kZXJlckl0ZW1zSW50ZXJ2YWxJbk1zO1xuXG4gICAgICAgIGxldCBjdXJyZW50SW5kZXggPSAwO1xuXG4gICAgICAgIGNvbnN0IGVuZCA9IHRoaXMubWFzdGVyRm9ybXMubGVuZ3RoO1xuICAgICAgICBjb25zb2xlLmxvZyhcInN0YXJ0IHJlbmRlcmluZy4uLlwiKTtcblxuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCArIElURU1TX1JFTkRFUkVEX0FUX09OQ0U7XG4gICAgICAgICAgICBmb3IgKGxldCBuID0gY3VycmVudEluZGV4OyBuIDw9IG5leHRJbmRleDsgbisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG4gPj0gZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMudGVtcGxhdGUsIHtcbiAgICAgICAgICAgICAgICAgICAgbWFzdGVyRm9ybTogdGhpcy5tYXN0ZXJGb3Jtc1tuXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICAgICAgY3VycmVudEluZGV4ICs9IElURU1TX1JFTkRFUkVEX0FUX09OQ0U7XG4gICAgICAgIH0sIElOVEVSVkFMX0lOX01TKTtcbiAgICB9O1xuXG4gICAgcHJvdGVjdGVkIGFkZFN1YnNjcmlwdGlvbih0eXBlOiBTdWJUeXBlLCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uOiBzdWJzY3JpcHRpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0KG1hc3RlckZvcm1zOiBNYXN0ZXJGb3JtW10pIHtcbiAgICAgICAgdGhpcy5hdXRvQWRkSW5wdXQobWFzdGVyRm9ybXMpO1xuICAgICAgICB0aGlzLmFkZFN1YnNjcmlwdGlvbihTdWJUeXBlLkRFRkFVTFQsIHRoaXMuZm9ybUdyb3VwLnZhbHVlQ2hhbmdlcy5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpLmZvckVhY2godmFsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmFsLmluY2x1ZGVzKCdfZmlsdGVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW3ZhbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtYXN0ZXJGb3Jtcy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZWwuY3VzdG9tRGF0YUZpZWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkYXRhID0gWy4uLnZhbHVlW2VsLm5hbWVdXTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVbZWwubmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YT8uZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2bCA9IGVsLnZhbHVlPy5maW5kKGUgPT4gZVtlbC5jdXN0b21EYXRhRmllbGQuc291cmNlRmllbGRdID09PSBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2VsLm5hbWVdLnB1c2godmxbZWwuY3VzdG9tRGF0YUZpZWxkLmlkRmllbGRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHRoaXMub25EYXRhLmVtaXQoPE1hc3RlckZvcm1IZWxwZXJEYXRhPGFueT4+e1xuICAgICAgICAgICAgICAgIGRhdGE6IHZhbHVlLFxuICAgICAgICAgICAgICAgIGZvcm06IHRoaXMuZm9ybUdyb3VwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMub25WYWxpZGF0ZS5lbWl0KCEodGhpcy5mb3JtR3JvdXAudmFsaWQpKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybUdyb3VwLnBhdGNoVmFsdWUodGhpcy5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMub25Jbml0LmVtaXQoPE1hc3RlckZvcm1IZWxwZXJEYXRhPGFueT4+e1xuICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgICAgICBmb3JtOiB0aGlzLmZvcm1Hcm91cFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJJdGVtKCk7XG4gICAgICAgIGlmICh0aGlzLm9uRXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvcm1Hcm91cC5lcnJvcnMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXRPbkVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbWl0T25FcnJvcigpIHtcbiAgICAgICAgdGhpcy5vbkVycm9yLmVtaXQoT2JqZWN0LmtleXModGhpcy5mb3JtR3JvdXAuY29udHJvbHMpXG4gICAgICAgICAgICAuZmlsdGVyKGtleSA9PiB0aGlzLmZvcm1Hcm91cC5jb250cm9sc1trZXldLnN0YXR1cyA9PT0gXCJJTlZBTElEXCIpXG4gICAgICAgICAgICAubWFwKG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBvYmplY3QsXG4gICAgICAgICAgICAgICAgICAgICdlcnJvcyc6IHRoaXMuZm9ybUdyb3VwLmNvbnRyb2xzW29iamVjdF0uZXJyb3JzLFxuICAgICAgICAgICAgICAgICAgICAnc3RhdHVzJzogdGhpcy5mb3JtR3JvdXAuY29udHJvbHNbb2JqZWN0XS5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICdpc1ZhbGlkJzogdGhpcy5mb3JtR3JvdXAuY29udHJvbHNbb2JqZWN0XS5zdGF0dXMgIT09IFwiSU5WQUxJRFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICBjb25zb2xlLmxvZygnZGVzdHJveScpXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiB7XG4gICAgICAgICAgICBpZiAoIXN1YnNjcmlwdGlvbi5zdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2YWJsZSkge1xuICAgICAgICAgICAgdGhpcy5hZGRTdWJzY3JpcHRpb24oU3ViVHlwZS5TWVNURU0sIHRoaXMub2JzZXJ2YWJsZS5zdWJzY3JpYmUobWFzdGVyRm9ybXMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWFzdGVyRm9ybXMgPSBtYXN0ZXJGb3JtcztcbiAgICAgICAgICAgICAgICB0aGlzLmluaXQobWFzdGVyRm9ybXMpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uT2JzZXJ2YWJsZVVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uT2JzZXJ2YWJsZVVwZGF0ZS5lbWl0KDxNYXN0ZXJGb3JtSGVscGVyRGF0YTxhbnk+PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHRoaXMuZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm06IHRoaXMuZm9ybUdyb3VwXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRPbkVycm9yKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWFzdGVyRm9ybXMpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdCh0aGlzLm1hc3RlckZvcm1zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZmlsdGVyKG1hc3RlckZvcm06IE1hc3RlckZvcm0sIHNlYXJjaDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghc2VhcmNoKSB7XG4gICAgICAgICAgICBtYXN0ZXJGb3JtLmZpbHRlcmVkVmFsdWUgPSBtYXN0ZXJGb3JtLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VhcmNoID0gc2VhcmNoLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hc3RlckZvcm0uY3VzdG9tRGF0YUZpZWxkKSB7XG4gICAgICAgICAgICBtYXN0ZXJGb3JtLmZpbHRlcmVkVmFsdWUgPSBtYXN0ZXJGb3JtLnZhbHVlLmZpbHRlcihpdGVtID0+IGl0ZW1bbWFzdGVyRm9ybS5jdXN0b21EYXRhRmllbGQuc291cmNlRmllbGRdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpID4gLTEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFzdGVyRm9ybS5maWx0ZXJlZFZhbHVlID0gbWFzdGVyRm9ybS52YWx1ZS5maWx0ZXIoaXRlbSA9PiBpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihzZWFyY2gpID4gLTEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldEl0ZW1zTGlzdChtYXN0ZXJGb3JtOiBNYXN0ZXJGb3JtKTogYW55W10ge1xuICAgICAgICBpZiAobWFzdGVyRm9ybS5oYXNGaWx0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXN0ZXJGb3JtLmZpbHRlcmVkVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hc3RlckZvcm0udmFsdWU7XG4gICAgfVxufVxuIiwiPGRpdj5cbiAgICA8bmctY29udGFpbmVyICNpdGVtc0NvbnRhaW5lcj48L25nLWNvbnRhaW5lcj5cbjxkaXY+XG48Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1Hcm91cFwiICNmb3JtRGlyZWN0aXZlPVwibmdGb3JtXCI+XG4gICAgPCEtLSA8ZGl2ICpuZ0Zvcj1cImxldCBtYXN0ZXJGb3JtIG9mIG1hc3RlckZvcm1zXCI+IC0tPlxuICAgIDxuZy10ZW1wbGF0ZSAjaXRlbSBsZXQtbWFzdGVyRm9ybT1cIm1hc3RlckZvcm1cIj5cbiAgICAgICAgPG1hdC1jaGlwIGNvbG9yPVwicHJpbWFyeVwiIHNlbGVjdGVkICpuZ0lmPVwiZm9ybUdyb3VwLmNvbnRyb2xzW21hc3RlckZvcm0ubmFtZV0gJiYgaXNMYWJlbChtYXN0ZXJGb3JtKVwiPnt7bWFzdGVyRm9ybS5kaXNwbGF5fX08L21hdC1jaGlwPlxuICAgICAgICA8bWF0LWRpdmlkZXIgKm5nSWY9XCJmb3JtR3JvdXAuY29udHJvbHNbbWFzdGVyRm9ybS5uYW1lXSAmJiBpc0xhYmVsKG1hc3RlckZvcm0pXCI+PC9tYXQtZGl2aWRlcj5cbiAgICAgICAgPG1hdC1mb3JtLWZpZWxkICpuZ0lmPVwiZm9ybUdyb3VwLmNvbnRyb2xzW21hc3RlckZvcm0ubmFtZV0gJiYgaXNJbnB1dChtYXN0ZXJGb3JtKVwiIGFwcGVhcmFuY2U9XCJmaWxsXCJcbiAgICAgICAgICAgIGNsYXNzPVwicmVnaXN0ZXItaW5wdXRcIj5cbiAgICAgICAgICAgIDxtYXQtbGFiZWw+e3ttYXN0ZXJGb3JtLmRpc3BsYXl9fTwvbWF0LWxhYmVsPlxuICAgICAgICAgICAgPGlucHV0IFtmb3JtQ29udHJvbE5hbWVdPVwibWFzdGVyRm9ybS5uYW1lXCIgW3R5cGVdPVwibWFzdGVyRm9ybS5pbnB1dFR5cGVcIiBtYXRJbnB1dCBbcGxhY2Vob2xkZXJdPVwibWFzdGVyRm9ybS5wbGFjZWhvbGRlclwiIFxuICAgICAgICAgICAgKGlucHV0KT1cIm1hc3RlckZvcm0ub25JbnB1dChmb3JtR3JvdXAuY29udHJvbHNbbWFzdGVyRm9ybS5uYW1lXSwgJGV2ZW50LnRhcmdldClcIiBcbiAgICAgICAgICAgIFttaW5MZW5ndGhdPVwibWFzdGVyRm9ybS5taW5MZW5ndGhcIiBbbWF4TGVuZ3RoXT1cIm1hc3RlckZvcm0ubWF4TGVuZ3RoXCIgW3JlcXVpcmVkXT1cIm1hc3RlckZvcm0ucmVxdWlyZWRcIj5cbiAgICAgICAgICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJtYXN0ZXJGb3JtLmVycm9yTWVzc2FnZUZ1bmN0aW9uICYmIGZvcm1Hcm91cC5jb250cm9sc1ttYXN0ZXJGb3JtLm5hbWVdLmludmFsaWRcIj5cbiAgICAgICAgICAgICAgICB7e21hc3RlckZvcm0uZXJyb3JNZXNzYWdlRnVuY3Rpb24oZm9ybUdyb3VwLmNvbnRyb2xzW21hc3RlckZvcm0ubmFtZV0pfX1cbiAgICAgICAgICAgIDwvbWF0LWVycm9yPlxuICAgICAgICAgICAgPG1hdC1pY29uICpuZ0lmPVwibWFzdGVyRm9ybS5oYXNJY29uXCIgbWF0U3VmZml4Pnt7bWFzdGVyRm9ybS5pY29ufX08L21hdC1pY29uPlxuICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxuICAgICAgICA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJmb3JtR3JvdXAuY29udHJvbHNbbWFzdGVyRm9ybS5uYW1lXSAmJiBpc1NlbGVjdChtYXN0ZXJGb3JtKVwiPlxuICAgICAgICAgICAgPG1hdC1zZWxlY3QgW2Zvcm1Db250cm9sTmFtZV09XCJtYXN0ZXJGb3JtLm5hbWVcIiBbcGxhY2Vob2xkZXJdPVwic2VsZWN0UGxhY2Vob2xkZXIobWFzdGVyRm9ybSlcIlxuICAgICAgICAgICAgICAgIFttdWx0aXBsZV09bWFzdGVyRm9ybS5pc011bHRpc2VsZWN0IFtyZXF1aXJlZF09XCJtYXN0ZXJGb3JtLnJlcXVpcmVkXCI+XG4gICAgICAgICAgICAgICAgPG1hdC1vcHRpb24gKm5nSWY9XCJtYXN0ZXJGb3JtLmhhc0ZpbHRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8bmd4LW1hdC1zZWxlY3Qtc2VhcmNoIFtmb3JtQ29udHJvbE5hbWVdPVwibWFzdGVyRm9ybS5uYW1lICsgJ19maWx0ZXInXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtwbGFjZWhvbGRlckxhYmVsXT1cIm1hc3RlckZvcm0uZmlsdGVyUGxhY2Vob2xkZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25vRW50cmllc0ZvdW5kTGFiZWxdPVwibWFzdGVyRm9ybS5maWx0ZXJOb0VudHJpZXNcIj48L25neC1tYXQtc2VsZWN0LXNlYXJjaD5cbiAgICAgICAgICAgICAgICA8L21hdC1vcHRpb24+XG4gICAgICAgICAgICAgICAgPG1hdC1vcHRpb24gKm5nSWY9XCIhbWFzdGVyRm9ybS5yZXF1aXJlZFwiIHZhbHVlPVwibnVsbFwiPkF1Y3VuPC9tYXQtb3B0aW9uPiA8IS0tIHRvZG86IGNoYW5nZSBjb25kaXRpb24gJiB2YWx1ZS0tPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IHZhbHVlIG9mIGdldEl0ZW1zTGlzdChtYXN0ZXJGb3JtKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bWF0LW9wdGlvbiAqbmdJZj1cIiFtYXN0ZXJGb3JtLmN1c3RvbURhdGFGaWVsZFwiIFt2YWx1ZV09XCJ2YWx1ZVwiPnt7IHZhbHVlIH19PC9tYXQtb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8bWF0LW9wdGlvbiAqbmdJZj1cIm1hc3RlckZvcm0uY3VzdG9tRGF0YUZpZWxkXCIgW3ZhbHVlXT1cInZhbHVlW21hc3RlckZvcm0uY3VzdG9tRGF0YUZpZWxkLnNvdXJjZUZpZWxkXVwiPnt7IHZhbHVlW21hc3RlckZvcm0uY3VzdG9tRGF0YUZpZWxkLnNvdXJjZUZpZWxkXSB9fTwvbWF0LW9wdGlvbj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgICAgICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJtYXN0ZXJGb3JtLmVycm9yTWVzc2FnZUZ1bmN0aW9uICYmIGZvcm1Hcm91cC5jb250cm9sc1ttYXN0ZXJGb3JtLm5hbWVdLmludmFsaWRcIj5cbiAgICAgICAgICAgICAgICB7e21hc3RlckZvcm0uZXJyb3JNZXNzYWdlRnVuY3Rpb24oZm9ybUdyb3VwLmNvbnRyb2xzW21hc3RlckZvcm0ubmFtZV0pfX1cbiAgICAgICAgICAgIDwvbWF0LWVycm9yPlxuICAgICAgICAgICAgPG1hdC1pY29uICpuZ0lmPVwibWFzdGVyRm9ybS5oYXNJY29uXCIgbWF0U3VmZml4Pnt7bWFzdGVyRm9ybS5pY29ufX08L21hdC1pY29uPlxuICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxuICAgICAgICA8ZGl2ICpuZ0lmPVwiZm9ybUdyb3VwLmNvbnRyb2xzW21hc3RlckZvcm0ubmFtZV0gJiYgaXNDaGVja2JveChtYXN0ZXJGb3JtKVwiIGNsYXNzPVwiYWRkLWJvdHRvbS1wYWRkaW5nXCI+XG4gICAgICAgICAgICA8bWF0LWNoZWNrYm94IFtmb3JtQ29udHJvbE5hbWVdPVwibWFzdGVyRm9ybS5uYW1lXCIgW3JlcXVpcmVkXT1yZXF1aXJlZD57e21hc3RlckZvcm0uZGlzcGxheX19PC9tYXQtY2hlY2tib3g+XG4gICAgICAgICAgICA8bWF0LWljb24gKm5nSWY9XCJtYXN0ZXJGb3JtLmhhc0ljb25cIiBtYXRTdWZmaXg+e3ttYXN0ZXJGb3JtLmljb259fTwvbWF0LWljb24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bWF0LWZvcm0tZmllbGQgKm5nSWY9XCJmb3JtR3JvdXAuY29udHJvbHNbbWFzdGVyRm9ybS5uYW1lXSAmJiBpc1RleHRhcmVhKG1hc3RlckZvcm0pXCIgYXBwZWFyYW5jZT1cImZpbGxcIlxuICAgICAgICAgICAgY2xhc3M9XCJyZWdpc3Rlci1pbnB1dFwiPlxuICAgICAgICAgICAgPG1hdC1sYWJlbD57e21hc3RlckZvcm0uZGlzcGxheX19PC9tYXQtbGFiZWw+XG4gICAgICAgICAgICA8dGV4dGFyZWEgW2Zvcm1Db250cm9sTmFtZV09XCJtYXN0ZXJGb3JtLm5hbWVcIiBtYXRJbnB1dCBbcGxhY2Vob2xkZXJdPVwibWFzdGVyRm9ybS5wbGFjZWhvbGRlclwiIFtyZXF1aXJlZF09XCJtYXN0ZXJGb3JtLnJlcXVpcmVkXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDxtYXQtZXJyb3IgKm5nSWY9XCJtYXN0ZXJGb3JtLmVycm9yTWVzc2FnZUZ1bmN0aW9uICYmIGZvcm1Hcm91cC5jb250cm9sc1ttYXN0ZXJGb3JtLm5hbWVdLmludmFsaWRcIj5cbiAgICAgICAgICAgICAgICB7e21hc3RlckZvcm0uZXJyb3JNZXNzYWdlRnVuY3Rpb24oZm9ybUdyb3VwLmNvbnRyb2xzW21hc3RlckZvcm0ubmFtZV0pfX1cbiAgICAgICAgICAgIDwvbWF0LWVycm9yPlxuICAgICAgICAgICAgPG1hdC1pY29uICpuZ0lmPVwibWFzdGVyRm9ybS5oYXNJY29uXCIgbWF0U3VmZml4Pnt7bWFzdGVyRm9ybS5pY29ufX08L21hdC1pY29uPlxuICAgICAgICA8L21hdC1mb3JtLWZpZWxkPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPCEtLSA8L2Rpdj4gLS0+XG48L2Zvcm0+Il19