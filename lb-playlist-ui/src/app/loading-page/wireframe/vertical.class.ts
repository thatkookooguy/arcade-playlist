export class Vertical {
  constructor(
    public x: number,
    public canvas: HTMLCanvasElement,
    public stokeStyle: string | CanvasGradient | CanvasPattern
  ) {

  }

  draw() {
    const c = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    c.beginPath();
    c.lineWidth = 3;
    c.strokeStyle = this.stokeStyle;
    c.moveTo(this.canvas.width / 2, 200);
    c.lineTo(this.x, this.canvas.height);
    c.stroke();
  }

  update() {
    this.draw();
  }
}
