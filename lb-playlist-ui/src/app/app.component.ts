import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kb-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  title = 'lb-playlist-ui';

  @HostListener('document:visibilitychange', [ '$event' ])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    if (document.hidden) {
      console.log('not looking!!!', document.hidden, new Date());
    } else {
      console.log('looking!!!', document.hidden, new Date());
    }
  }

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    translate: TranslateService
  ) {
    translate.addLangs([ 'en', 'heb' ]);
    translate.setDefaultLang('en');
    translate.use('en');
  }

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
