import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <form style="display: contents;" [formGroup]="reactiveForm">
        <div class="col-1">
            <input type="number" formControlName="inputNum"/>
        </div>
        <div class="col-2">
          <select formControlName="isCheck">
            <option value="isPrime">isPrime</option>
            <option value="isFibonacci">isFibonacci</option>
          </select>
        </div>
        <div class="col-3">
          {{ isCheckView }}
        </div>
      </form>
  </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pretest-section2-question1';
  reactiveForm: FormGroup = this.formBuilder.group({ inputNum: undefined, isCheck: 'isPrime' });
  subscription: Subscription | undefined;
  isCheckView: boolean = undefined!;
  constructor(private formBuilder: FormBuilder) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscription = this.reactiveForm.get("inputNum")?.valueChanges
      .pipe(debounceTime(1000)).subscribe( val => {
        if(val < 0 )
          this.reactiveForm.get("inputNum")?.patchValue(0);
        else if(val % 1 != 0)
          this.reactiveForm.get("inputNum")?.patchValue(Math.round(val));
        else
          this.reactiveForm.get("inputNum")?.patchValue(+val);
        this.isCheckView = this.isChecks(this.reactiveForm.get("inputNum")?.value as number)
    })
  }

  isChecks(num: number, checkType = this.reactiveForm.get("isCheck")?.value): boolean {
    if(checkType === "isPrime"){
      for (var i = 2; i < num; i++) if (num % i === 0) return false;
      return true;
    }else if(checkType === "isFibonacci"){
      const fibonacci:any = (query:any, count = 1, last = 0) => {
        if(count < query){
           return fibonacci(query, count+last, count);
        };
        if(count === query){
           return true;
        }
        return false;
      }
      return fibonacci(num);
    }else
      return undefined!;
  }

}
