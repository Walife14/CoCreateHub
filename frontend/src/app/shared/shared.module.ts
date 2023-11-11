import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputContainerComponent } from './component/input-container/input-container.component';
import { InputValidationComponent } from './component/input-validation/input-validation.component';
import { TextInputComponent } from './component/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultButtonComponent } from './component/default-button/default-button.component';
import { LoadingComponent } from './component/loading/loading.component';
import { NavComponent } from './component/nav/nav.component';
import { AppRoutingModule } from '../app-routing.module';
import { LinkComponent } from './component/link/link.component';
import { CardComponent } from './component/card/card.component';



@NgModule({
  declarations: [
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    LoadingComponent,
    NavComponent,
    LinkComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  exports: [
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    LoadingComponent,
    NavComponent,
    LinkComponent,
    CardComponent
  ]
})
export class SharedModule { }
