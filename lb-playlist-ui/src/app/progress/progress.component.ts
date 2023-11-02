import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'kb-progress',
  templateUrl: './progress.component.html',
  styleUrls: [ './progress.component.scss' ]
})
export class ProgressComponent implements OnChanges, OnInit {
  public progressCirclePercent = 0;
  @Input() public progress = 0;
  @Input() public radius = 90;

  ngOnInit(): void {
    this.updateProgress();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateProgress();
  }

  updateProgress() {
    if (isNaN(this.progress)) {
      this.progress = 100;
    } else {
      const r = this.radius;
      const c = Math.PI * (r * 2);

      if (this.progress < 0) { this.progress = 0; }
      if (this.progress > 100) { this.progress = 100; }

      this.progressCirclePercent = ((100 - this.progress) / 100) * c;
    }
  }
}
