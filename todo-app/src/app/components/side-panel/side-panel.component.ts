import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent implements OnDestroy {
  @Output() toggle = new EventEmitter<void>();
  isCollapsed: boolean = false;
  private destroy$ = new Subject<void>();

  backlogLinkText: string = 'Backlog';
  boardLinkText: string = 'Board';

  togglePanel(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
