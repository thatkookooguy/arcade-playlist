import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lb-playlist-ui';

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('(') && event.url.includes(')')) {
          this.renderer.addClass(document.body, 'modal-open');
        } else {
          this.renderer.removeClass(document.body, 'modal-open');
        }
      }
    });
  }
}
