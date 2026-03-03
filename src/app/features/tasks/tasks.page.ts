import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../core/services/task';
import { CategoryService } from '../../core/services/category';
import { Task } from '../../shared/models/task.model';
import { Category } from '../../shared/models/category.model';
import { FeatureFlagService } from '../../core/services/feature-flag'; 

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false
})
export class TasksPage implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  
  newTaskTitle: string = '';
  selectedCategoryId: string = '';
  filterCategoryId: string = 'all';
  
  isFilterEnabled: boolean = true;
  
  viewMode: 'pending' | 'completed' | 'deleted' = 'pending';

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private featureFlagService: FeatureFlagService
  ) {}

  async ngOnInit() {
    await this.loadData();
    this.isFilterEnabled = await this.featureFlagService.isCategoryFilterEnabled();
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.tasks = await this.taskService.getTasks();
    this.categories = await this.categoryService.getCategories();
    this.applyFilter();
  }

  async addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle,
      completed: false,
      categoryId: this.selectedCategoryId,
      deleted: false
    };

    await this.taskService.addTask(newTask);
    this.newTaskTitle = '';
    await this.loadData();
  }

  async toggleTask(id: string) {
    await this.taskService.toggleTask(id);
    await this.loadData();
  }

  async deleteTask(id: string) {
    await this.taskService.deleteTask(id);
    await this.loadData();
  }

  async restoreTask(id: string) {
    await this.taskService.restoreTask(id);
    await this.loadData();
  }

  async hardDeleteTask(id: string) {
    await this.taskService.hardDeleteTask(id);
    await this.loadData();
  }

  segmentChanged(event: any) {
    this.viewMode = event.detail.value;
    this.applyFilter();
  }

  onFilterChange(event: any) {
    this.filterCategoryId = event.detail.value;
    this.applyFilter();
  }

  applyFilter() {
    let tempTasks = this.tasks;

    if (this.viewMode === 'deleted') {
      tempTasks = tempTasks.filter(t => t.deleted);
    } else if (this.viewMode === 'completed') {
      tempTasks = tempTasks.filter(t => t.completed && !t.deleted);
    } else {
      tempTasks = tempTasks.filter(t => !t.completed && !t.deleted);
    }

    if (this.filterCategoryId !== 'all') {
      tempTasks = tempTasks.filter(t => t.categoryId === this.filterCategoryId);
    }

    this.filteredTasks = tempTasks;
  }

  trackById(index: number, item: Task): string {
    return item.id;
  }
}