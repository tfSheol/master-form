import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MasterForm, MasterFormHelperData, MasterFormHelperInterface, MasterFormType } from 'master-form';
import { of } from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog-add-input',
  templateUrl: './dialog-add-input.component.html',
  styleUrls: ['./dialog-add-input.component.css']
})
export class DialogAddInputComponent implements MasterFormHelperInterface<any>, OnInit {
  public dataInput: any = <any>{};
  public disabled: boolean = true;
  public errors: any[] = [];

  private typeList = {
    'input': 0,
    'select': 1,
    'checkbox': 2,
    'textarea': 3,
    'label': 4
  };
  
  constructor(
    public dialogRef: MatDialogRef<DialogAddInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  public masterForms: MasterForm[] = [
    {
      name: 'name',
      display: 'Name',
      controls: Validators.required,
      required: true,
      errorMessageFunction: (formControl: FormControl) => formControl.hasError("required") ? "Vous devez rentrer une valeur" : ""
    }, {
      name: 'display',
      display: 'Display',
      controls: Validators.required,
      required: true,
      errorMessageFunction: (formControl: FormControl) => formControl.hasError("required") ? "Vous devez rentrer une valeur" : ""
    }, {
      name: 'type',
      display: 'Selection',
      type: MasterFormType.SELECT,
      hasFilter: true,
      filterPlaceholder: 'find a type',
      data: () => of(Object.keys(this.typeList))
    }, {
      name: 'inputType',
      display: 'Input Type',
      type: MasterFormType.SELECT,
      hasFilter: true,
      filterPlaceholder: 'find an input type',
      data: () => of(['color', 'date', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'tel', 'text', 'time', 'url', 'week'])
    }, {
      name: 'required',
      display: 'Required ?',
      type: MasterFormType.CHECKBOX
    }
  ]

  onInit(data: MasterFormHelperData<any>): void {
    
  }

  validate(disabled: boolean): void {
    this.disabled = disabled;
  }

  onData(data: MasterFormHelperData<any>): void {
    this.dataInput = data.data;
  }

  onError?(errors: any[]): void {
    this.errors = errors.filter(error => !error.isValid);
  }

  onObservableUpdate?(data: MasterFormHelperData<any>): void {
    data.form.markAllAsTouched();
  }

  onValidate(): void {
    this.dataInput.type = this.typeList[this.dataInput.type];
    this.dialogRef.close(this.dataInput);
  }
}
