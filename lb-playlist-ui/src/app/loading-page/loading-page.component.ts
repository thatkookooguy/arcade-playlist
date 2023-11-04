import { debounce } from 'lodash-es';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { Horizontal } from './wireframe/horizontal.class';
import { Vertical } from './wireframe/vertical.class';

@Component({
  selector: 'kb-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: [ './loading-page.component.scss' ]
})
export class LoadingPageComponent implements AfterViewInit {
  constructor(
    private elRef: ElementRef
  ) {}

  private horizontalArray: Horizontal[] = [];
  private verticalArray: Vertical[] = [];

  @ViewChild('backgroundCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;

  @HostListener('window:resize', [ '$event' ])
  onResize() {
    this.updateCanvas();
  }

  updateCanvas = debounce(() => {
    this.canvas.width = this.elRef.nativeElement.clientWidth;
    this.canvas.height = this.elRef.nativeElement.clientHeight;
  }, 500);

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = this.elRef.nativeElement.clientWidth;
    this.canvas.height = this.elRef.nativeElement.clientHeight;

    const c = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    const grad = c.createLinearGradient(0, this.canvas.height, 0, 0);
    grad.addColorStop(0, 'rgba(255, 0, 255, 0.5)');
    grad.addColorStop(0.55, 'rgba(255, 0, 255, 0)');
    grad.addColorStop(1.0, 'rgba(255, 0, 255, 0)');

    const interval = (this.canvas.width / 10);
    let cross = 0 - interval * 8;

    for (let i = 0; i < 27; i++) {
      this.verticalArray.push(new Vertical(
        cross,
        this.canvas,
        grad
      ));
      cross += interval;
    }

    setInterval(() => {
      this.horizontalArray.push(new Horizontal(
        this.canvas.height / 2,
        this.canvas,
        this.horizontalArray
      ));
    }, 300);

    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const c = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.horizontalArray.length; i++) {
      this.horizontalArray[i].update();
    }
    for (let i = 0; i < this.verticalArray.length; i++) {
      this.verticalArray[i].update();
    }
  }
}
