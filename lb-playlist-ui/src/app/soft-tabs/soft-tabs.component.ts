import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'kb-soft-tabs',
  templateUrl: './soft-tabs.component.html',
  styleUrls: [ './soft-tabs.component.scss' ]
})
export class SoftTabsComponent {
  @Input() tabs: string[] = [];

  @Input() activeTab!: string;
  @Output() activeTabChange = new EventEmitter<string>();

  @Output()
    handleTabSelection = new EventEmitter<string>();

  selectTab(tabIndex: number) {
    console.log('selectTab', tabIndex);
    this.activeTab = this.tabs[tabIndex];
    this.activeTabChange.emit(this.activeTab);
    // this.handleTabSelection.emit(this.tabs[tabIndex]);
  }
}
