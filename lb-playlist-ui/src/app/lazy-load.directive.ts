import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[kbLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {
  
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this));
    this.observer.observe(this.el.nativeElement);
  }

  handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }
}
