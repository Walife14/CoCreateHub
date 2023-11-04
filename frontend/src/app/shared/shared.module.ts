import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputContainerComponent } from './component/input-container/input-container.component';
import { InputValidationComponent } from './component/input-validation/input-validation.component';
import { TextInputComponent } from './component/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultButtonComponent } from './component/default-button/default-button.component';
import { LoadingComponent } from './component/loading/loading.component';



@NgModule({
  declarations: [
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
