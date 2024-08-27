import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoListItemComponentComponent } from './to-do-list-item-component.component';

describe('ToDoListItemComponentComponent', () => {
  let component: ToDoListItemComponentComponent;
  let fixture: ComponentFixture<ToDoListItemComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToDoListItemComponentComponent]
    });
    fixture = TestBed.createComponent(ToDoListItemComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
