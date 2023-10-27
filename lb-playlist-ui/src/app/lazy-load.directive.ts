import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[kbLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {
  private observer!: IntersectionObserver;

  @Output() kbImageLoaded = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
    this.observer.observe(this.el.nativeElement);
  }

  handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const dataSrc = img.getAttribute('data-src');
        if (dataSrc) {
          img.onload = () => {
            // Replace placeholder with actual image
            img.src = dataSrc;
            this.kbImageLoaded.emit(true);
            img.removeAttribute('data-src');
          };
          // Start loading the actual image
          img.src = dataSrc;
        }
        observer.unobserve(img);
      }
    });
  }
}
