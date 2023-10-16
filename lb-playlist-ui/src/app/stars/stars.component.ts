import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

export type Size = 'small' | 'medium' | 'large';
const sizeClassList: Array<Size> = ['small', 'medium', 'large'];

@Component({
  selector: 'kb-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit, OnChanges {
  private readonly MAX_RATING = 5;
  public ratingPercentage: number = 0;
  modalClassName: string = 'kb-medium';
  @Input() rating: number = 0;
  @Input() size: Size = 'medium';
  
  ngOnInit(): void {
    this.ratingPercentage = +((this.rating / this.MAX_RATING) * 100).toFixed(2);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['size']) {
      this.updateModalSize();
    }
  }

  private updateModalSize() {
    const isValid = sizeClassList.includes(this.size);
    this.modalClassName = 'kb-' + (isValid ? this.size : 'medium');
  }
}
