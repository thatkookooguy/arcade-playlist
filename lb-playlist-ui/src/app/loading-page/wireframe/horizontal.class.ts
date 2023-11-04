export class Horizontal {
  dy = 0.5;
  opacity = 0;
  constructor(
    public y: number,
    public canvas: HTMLCanvasElement,
    public horizontalArrayToUpdate: Horizontal[]
  ) {}

  draw() {
    const c = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    c.beginPath();
    c.lineWidth = 3;
    c.strokeStyle = `rgba(255, 0, 255, ${ this.opacity })`;
    c.moveTo(0, this.y);
    c.lineTo(this.canvas.width, this.y);
    c.stroke();
  }

  update() {
    if (this.y >= this.canvas.height) {
      this.horizontalArrayToUpdate.splice(this.horizontalArrayToUpdate.indexOf(this), 1);
    }

    this.opacity += 0.003;

    this.dy += 0.05;
    this.y += this.dy;
    this.draw();
  }
}
