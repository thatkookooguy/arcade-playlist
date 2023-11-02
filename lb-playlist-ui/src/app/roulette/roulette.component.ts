import { uniqBy } from 'lodash-es';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * BEHAVIOR:
 * - input itemHeight, default 100; this is the height of each item in the list
 * - Initialize list data, currentIndex, and currentSelectedItem
 * - calculate the number of items that can be displayed on the screen. make sure it's an odd number.
 * - show items from currentIndex to currentIndex + itemsPerScreen
 * - selected item is the middle item on the screen. calculate it by itemsPerScreen / 2 and round it down.
 *
 * - when spinning the roulette, basically update the currentIndex++, remove the first item, add one to the end
 * - when the currentIndex is updated, update the currentSelectedItem
 *
 * EDGE CASEs:
 * 1. when list is shorter than itemsPerScreen, show the list as is and move the selected item instead of the list
 *   (allow it to move around instead of staying in the middle)
 * 2. When reaching start or end of list, loop around
 * 3. When reaching end - itemsPerScreen as the currentIndex, move the cursor instead of the list
 * 4. When last item on screen is start + itemsPerScreen, move the cursor instead of the list
 */
@Component({
  selector: 'kb-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: [ './roulette.component.scss' ]
})
export class RouletteComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  playlistData: any = {};
  // Initialize with your data
  listData: any[] = [];
  currentIndex: number = 0;
  currentSelectedItem: any;
  currentSelectedItemIndex?: number;
  currentOriginalListSelectedItemIndex?: number;
  // calculated based on component height and item height
  itemsPerScreen: number = 0;
  itemsOnScreen: string[] = [];
  // maximum speed for spinning. once per 100ms
  maxSpeed: number = 100;
  acceleration: number = 30;
  // current speed, starts from once per second
  currentSpeed: number = 300;
  // to store interval for speed
  speedInterval: any;

  @Input() public itemHeight = 40;

  @Input() public spin = false;

  @Output() public currentItemIndex = new EventEmitter<number>();
  @Output() public rouletteStopped = new EventEmitter<number>();

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private readonly httpClient: HttpClient,
    private readonly route: ActivatedRoute,
    private el: ElementRef
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // eslint-disable-next-line dot-notation
    const spinChange = changes['spin'];
    if (spinChange) {
      if (spinChange.currentValue && !spinChange.previousValue) {
        this.startSpinning();
      }
      if (!spinChange.currentValue && spinChange.previousValue) {
        this.stopSpinning();
      }
    }
  }

  ngOnInit(): void {
    console.log('started');
  }

  ngAfterViewInit(): void {
    this.getData().subscribe((playlistData: any) => {
      const playlistDataParsed = {
        ...playlistData,
        games: uniqBy(playlistData.games, 'title')
      };

      playlistDataParsed.games = playlistDataParsed.games.map((game: any) => ({
        ...game,
        collectionImage: `${ this.baseHref }assets/optimized/${ game.cover.replace('.png', '.webp').replace('.jpg', '.webp').replace('.jpeg', '.webp') }`
      }));

      this.listData = playlistDataParsed.games.map((game: any) => game.title as string);

      this.calculateItemsPerScreen();
      // this.startSpinning();
    });
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  getData() {
    return this.httpClient.get(`${ this.baseHref }assets/playlist-data.json`);
  }

  calculateItemsPerScreen() {
    const componentHeight = this.el.nativeElement.clientHeight;
    const itemsCount = Math.floor(componentHeight / this.itemHeight);
    // ensure odd number of items
    this.itemsPerScreen = itemsCount % 2 === 0 ? itemsCount - 1 : itemsCount;
    this.itemsOnScreen = this.listData.slice(this.currentIndex, this.currentIndex + this.itemsPerScreen);
    this.setCurrentSelectedItem();
  }

  setCurrentSelectedItem() {
    const middleIndex = Math.floor(this.itemsPerScreen / 2);
    this.currentSelectedItem = this.listData[this.currentIndex + middleIndex];
    this.currentSelectedItemIndex = middleIndex;
    this.currentOriginalListSelectedItemIndex = this.currentIndex + middleIndex;

    this.currentItemIndex.emit(this.currentOriginalListSelectedItemIndex);
  }

  updateCurrentIndex() {
    if (this.currentIndex >= this.listData.length - this.itemsPerScreen) {
      // Loop back to the start
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.itemsOnScreen = this.listData.slice(this.currentIndex, this.currentIndex + this.itemsPerScreen);
    this.setCurrentSelectedItem();
  }

  startSpinning() {
    // Start spinning slowly
    clearInterval(this.speedInterval);
    this.speedInterval = setTimeout(() => {
      if (this.currentSpeed > this.maxSpeed) {
        this.currentSpeed -= this.acceleration;
        this.currentSpeed = this.currentSpeed < this.maxSpeed ? this.maxSpeed : this.currentSpeed;
      }
      this.updateCurrentIndex();
      this.startSpinning();
      // the speed increases as currentSpeed increases
    }, this.currentSpeed);
  }

  stopSpinning() {
    // Start slowing down
    clearInterval(this.speedInterval);
    this.speedInterval = setTimeout(() => {
      const shouldStop = this.currentSpeed >= 300;
      if (!shouldStop) {
        this.currentSpeed += this.acceleration;
      } else {
        // Stop the spinning
        clearInterval(this.speedInterval);
      }

      if (!shouldStop) {
        this.updateCurrentIndex();
        this.stopSpinning();
      } else {
        clearInterval(this.speedInterval);
        this.rouletteStopped.emit(this.currentOriginalListSelectedItemIndex);
      }
      // the speed decreases as currentSpeed decreases
    }, this.currentSpeed);
  }
}
