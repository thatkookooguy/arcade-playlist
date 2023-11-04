/* eslint-disable no-undefined */
import { uniqBy } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'kb-attract-mode',
  templateUrl: './attract-mode.component.html',
  styleUrls: [ './attract-mode.component.scss' ]
})
export class AttractModeComponent implements OnInit, AfterViewInit, OnDestroy {
  public playlistData: any = {};
  public currentGame: any;
  public currentGameIndex = 0;
  public loading = true;
  hideLoader = false;
  public progress = 0;
  public images: string[] = [];
  private loadedImages = 0;
  showDetails = false;
  private intervalId?: ReturnType<typeof setInterval>;
  spin = false;
  private showDetailsTimeout = 30000;
  private baseSpinTime = 12000;
  public threeDBoxUrlBase: string = `${ this.baseHref }assets/3DBB/box.html`;
  public threeDBoxUrl?: SafeResourceUrl;

  @ViewChild('gameVideo')
    gameVideo!: ElementRef<HTMLVideoElement>;

  constructor(
    private readonly httpClient: HttpClient,
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  async ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);

    const videoElement = this.gameVideo?.nativeElement;
    await this.fadeOutVideoVolume();
    videoElement.pause();
  }

  ngAfterViewInit(): void {
    console.log('attract-mode started');
  }

  ngOnInit(): void {
    combineLatest([
      this.httpClient.get(`${ this.baseHref }assets/playlist-data.json`),
      this.route.queryParamMap
    ])
      .subscribe(([ playlistData, queryParams ]: any) => {
        this.playlistData = {
          ...playlistData,
          games: uniqBy(playlistData.games, 'title')
        };

        this.playlistData.games = this.playlistData.games.map((game: any) => ({
          ...game,
          collectionImage: `${ this.baseHref }assets/optimized/${ game.cover.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp') }`
        }));

        this.images = this.playlistData.games.map((game: any) => game.collectionImage);

        this.loadImages();

        this.currentGame = this.playlistData.games[0];
      });
  }

  loadImages() {
    this.images.forEach((image) => {
      const img = new Image();
      img.onload = () => {
        this.loaded();
      };
      img.src = image;
    });
  }

  loaded() {
    this.loadedImages++;
    this.progress = Math.round((this.loadedImages / this.images.length) * 100);
    if (this.images.length === this.loadedImages) {
      console.log('all images loaded');
      // this.expose();
    }
  }

  expose() {
    this.loading = false;
    setTimeout(() => this.spinRoulette(), 1200);
  }

  spinRoulette() {
    this.showDetails = false;
    this.spin = true;

    setTimeout(() => {
      this.spin = false;
    }, this.calcSpinTime());
  }

  handleSelectedGame() {
    this.showDetails = true;

    const normalizedFrontHeight = 220;
    const normalizationFactor = normalizedFrontHeight / this.currentGame.frontHeight;
    const normalizedFrontWidth = this.currentGame.frontWidth * normalizationFactor;
    const normalizedSplineWidth = this.currentGame.splineWidth ?
      (this.currentGame.splineWidth * (normalizedFrontHeight / this.currentGame.splineHeight)) :
      undefined;
    this.threeDBoxUrl = this.currentGame.box3D ?
    this.sanitizer.bypassSecurityTrustResourceUrl([
      this.threeDBoxUrlBase,
      // Background Color
      '?b=212121',
      // Height, Width, Depth
      `&h=${ normalizedFrontHeight || 220 }`,
      `&w=${ normalizedFrontWidth || 180 }`,
      `&d=${ normalizedSplineWidth || 40 }`,
      // Size: relative size that your big box should be rendered (100% is default)
      '&s=100',
      // Zoom: defines if your big box is zoomable (1 = zoomable; 0 = not zoomable)
      '&z=1',
      // Fullscreen: Allows fullscreen view in new tab (1 = allowed; 0 = not allowed)
      '&f=1',
      '&a=1',
      // Texture Template
      `&t=${ this.baseHref + 'assets/3d-box-textures/' + this.currentGame.box3D }`
    ].join('')) : undefined;

    setTimeout(async () => {
      if (this.gameVideo) {
        const videoElement = this.gameVideo.nativeElement;

        await this.fadeOutVideoVolume();

        videoElement.pause();
        videoElement.currentTime = 0;
      }
      this.spinRoulette();
    }, this.showDetailsTimeout);
  }

  calcSpinTime() {
    const lessOrMore = Math.random() > 0.5 ? 1 : -1;
    return this.baseSpinTime + (Math.floor(Math.random() * 1500) * lessOrMore);
  }

  fadeOutVideoVolume(): Promise<boolean> {
    const videoElement = this.gameVideo?.nativeElement;

    if (!videoElement) {
      return Promise.reject(
        new Error('Video element does not exists yet.')
      );
    }

    return new Promise((resolve) => {
      const interval = 100;
      const decreaseAmount = 0.05;
      const fadeOutInterval = setInterval(() => {
        if (videoElement!.volume > decreaseAmount) {
          videoElement!.volume -= decreaseAmount;
        } else {
          videoElement!.volume = 0;
          clearInterval(fadeOutInterval);
          resolve(true);
        }
      }, interval);
    });
  }
}
