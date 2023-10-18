import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'kb-soft-tabs',
  templateUrl: './soft-tabs.component.html',
  styleUrls: [ './soft-tabs.component.scss' ]
})
export class SoftTabsComponent implements OnInit {
  activeTab: string = '';
  activeTabIndex: number = 0;

  @Input() tabs: string[] = [];

  @Output()
    handleTabSelection = new EventEmitter<string>();

  ngOnInit(): void {
    this.activeTab = this.tabs[this.activeTabIndex];
  }

  selectTab(tabIndex: number) {
    console.log('selectTab', tabIndex);
    this.activeTabIndex = tabIndex;
    this.activeTab = this.tabs[tabIndex];
    this.handleTabSelection.emit(this.tabs[tabIndex]);
  }
}
