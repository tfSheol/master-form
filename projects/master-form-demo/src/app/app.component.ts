import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MasterForm, MasterFormHelperInterface, MasterFormType, MasterFormHelperData, MasterFormService } from 'master-form';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { pluck, share, shareReplay, tap } from 'rxjs/operators';
import { DialogAddInputComponent } from './dialog/dialog-add-input/dialog-add-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements MasterFormHelperInterface<any>, OnInit {
  title = 'master-form-demo';
  public data: any = <any>{};
  public preloadData: any = <any>{};
  public disabled: boolean = true;
  public errors: any[] = [];
  public change: EventEmitter<void> = new EventEmitter();
  public render: EventEmitter<void> = new EventEmitter();

  // public jsonData: BehaviorSubject<MasterForm[]> = new BehaviorSubject([]);
  // public observable: Observable<MasterForm> = this.jsonData.asObservable();

  constructor(
    private http: HttpClient,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    public masterFormService: MasterFormService
  ) { }

  async ngOnInit() {
    // this.jsonData
    //   .pipe(
    //     shareReplay({
    //       bufferSize: 1,
    //       refCount: true
    //     })
    //   ).subscribe(() => {
    //     this.data = this.preloadData;
    //   });

    // this.jsonData.next(this.masterForms);
    
    
    // this.jsonData.
    // this.jsonData.subscribe(de => {
    //   de.forEach(i => this.masterForms.push(i));
    // });
    // this.changeDetectorRefs.detectChanges();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddInputComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result !== undefined) {
        this.masterForms.push(result);
        // this.jsonData.next([result]);
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  public masterForms: MasterForm[] = [
    {
      name: 'name',
      display: 'Name',
      controls: Validators.required,
      required: true,
      errorMessageFunction: (formControl: FormControl) => formControl.hasError("required") ? "You must enter a value" : ""
    }, {
      name: 'selector',
      display: 'Selector',
      type: MasterFormType.SELECT,
      hasFilter: true,
      filterPlaceholder: 'find a test ?',
      nullable: true,
      data: () => of(["test1", "test2"])
    }, {
      name: 'description',
      display: 'Description',
      type: MasterFormType.TEXTAREA
    }, {
      name: 'dog',
      display: 'is Dog ?',
      type: MasterFormType.CHECKBOX
    }, {
      name: 'birthday',
      display: 'Birthday',
      type: MasterFormType.INPUT,
      inputType: 'date'
    }, {
      name: 'phone',
      display: 'Phone number',
      controls: [Validators.required, Validators.pattern("[0-9]{10}")],
      errorMessageFunction: (formControl: FormControl) => {
        if (formControl.hasError("required")) {
          return "You must enter a value";
        }
        if (formControl.hasError("pattern")) {
          return "The phone number is invalid !";
        }
        return "";
      },
      type: MasterFormType.INPUT,
      inputType: 'tel'
    }, {
      name: 'time',
      display: 'Time',
      type: MasterFormType.INPUT,
      inputType: 'time'
    }, {
      name: 'blog',
      display: 'Blog url',
      type: MasterFormType.INPUT,
      inputType: 'url'
    }
  ];

  clear() {
    this.data = null;
    this.errors = [];
    this.masterForms = [];
    // this.jsonData.next([]);
    this.change.emit();
  }

  reload() {
    // console.log(this.jsonData.getValue());
    this.render.emit();
    // this.jsonData.next(this.masterForms);
  }

  onInit(data: MasterFormHelperData<any>): void {
  }

  validate(disabled: boolean): void {
    this.disabled = disabled;
  }

  onData(data: MasterFormHelperData<any>): void {
    console.log(data);
    this.data = data.data;
  }

  onError(errors: any[]): void {
    console.log("errors", errors);
    this.errors = errors.filter(error => !error.isValid);
  }

  onObservableUpdate(data: MasterFormHelperData<any>): void {
    data.form.markAllAsTouched();
  }
}
