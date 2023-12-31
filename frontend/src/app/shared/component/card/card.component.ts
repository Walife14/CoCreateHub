import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() title!: string;
  @Input() text!: string;
  @Input() link!: string;
  @Input() lines?: boolean = false;
  @Input() techs?: string[];

  constructor() { }

  ngOnInit() {
  }

}
