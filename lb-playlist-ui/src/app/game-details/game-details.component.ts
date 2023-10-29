import { combineLatest } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterContentInit, Component, ElementRef, HostBinding, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'kb-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: [ './game-details.component.scss' ]
})
export class GameDetailsComponent implements OnInit, AfterContentInit {
  private gameId?: string;
  public gameDetails: any;
  public platform: any;
  public muted: boolean = true;
  private videoIntervalId?: any;
  public threeDBoxUrlBase: string = `${ this.baseHref }assets/3DBB/box.html`;
  public threeDBoxUrl?: SafeResourceUrl;
  public readonly tabs = [
    'Video',
    '3D Box'
  ];
  public activeTab = this.tabs[0];

  @HostBinding('class.hide') hide: boolean = false;
  @ViewChild('gameVideo')
    gameVideo!: ElementRef;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) { }
  ngOnInit(): void {
    combineLatest([
      this.httpClient.get(`${ this.baseHref }assets/playlist-data.json`),
      this.route.params
    ])
      .subscribe(([ playlistData, params ]: any) => {
        this.gameId = params.id;
        this.gameDetails = playlistData.games.find((game: any) => game.id === this.gameId);
        this.platform = (playlistData.platforms as any)[this.gameDetails.platform];
        const normalizedFrontHeight = 220;
        const normalizationFactor = normalizedFrontHeight / this.gameDetails.frontHeight;
        const normalizedFrontWidth = this.gameDetails.frontWidth * normalizationFactor;
        const normalizedSplineWidth = this.gameDetails.splineWidth ?
          (this.gameDetails.splineWidth * (normalizedFrontHeight / this.gameDetails.splineHeight)) :
          undefined;
        this.threeDBoxUrl = this.gameDetails.box3D ?
        this.sanitizer.bypassSecurityTrustResourceUrl([
          this.threeDBoxUrlBase,
          // Background Color
          '?b=212121',
          // Height, Width, Depth
          `&h=${ normalizedFrontHeight || 220 }`,
          `&w=${ normalizedFrontWidth || 180 }`,
          `&d=${ normalizedSplineWidth || 40 }`,
          // Size: relative size that your big box should be rendered (100% is default)
          '&s=80',
          // Zoom: defines if your big box is zoomable (1 = zoomable; 0 = not zoomable)
          '&z=1',
          // Fullscreen: Allows fullscreen view in new tab (1 = allowed; 0 = not allowed)
          '&f=1',
          '&a=1',
          // Texture Template
          `&t=${ this.baseHref + 'assets/3d-box-textures/' + this.gameDetails.box3D }`
        ].join('')) : undefined;
        this.activeTab = this.gameDetails.video ? this.tabs[0] : this.tabs[1];
        this.videoIntervalId = setInterval(() => {
          if (this.gameVideo?.nativeElement) {
            this.gameVideo.nativeElement.muted = !this.router.navigated;
            this.gameVideo.nativeElement.volume = 0.1;
            clearInterval(this.videoIntervalId);
          }
        }, 1000);
      });
  }

  ngAfterContentInit(): void {
    this.hide = false;
  }

  handleActiveTabChange(tab: string) {
    this.activeTab = tab;
  }

  closeDetails() {
    this.hide = true;

    // listen to transition end event once and navigate back to game collection
    this.elRef.nativeElement.addEventListener('animationend', () => {
      this.router.navigate([ { outlets: { 'game-details': null } } ], {
        queryParamsHandling: 'merge'
      });
    }, { once: true });
  }

  toggleMute(video: HTMLVideoElement) {
    if (video.muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
  }
}
