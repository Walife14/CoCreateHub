import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'default-button',
  templateUrl: './default-button.component.html',
  styleUrls: ['./default-button.component.css']
})
export class DefaultButtonComponent {

  @Input() type: 'submit' | 'button' = 'submit';
  @Input() text: string = 'Submit';
  @Input() inverted: boolean = false;
  @Output() onClick = new EventEmitter()

  @Input() isLoading = false;

}
