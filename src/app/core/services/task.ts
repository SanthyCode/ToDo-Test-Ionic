import { Injectable, Inject } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { IStorageRepository } from '../interfaces/istorage.repository';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks_data';
  private tasks: Task[] = [];

  constructor(
    @Inject('IStorageRepository') private storage: IStorageRepository<Task>
  ) {
    this.init();
  }

  private async init() {
    this.tasks = await this.storage.getAll(this.STORAGE_KEY);
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }

  async addTask(task: Task): Promise<void> {
    this.tasks.push(task);
    await this.storage.saveAll(this.STORAGE_KEY, this.tasks);
  }

  async toggleTask(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
      await this.storage.saveAll(this.STORAGE_KEY, this.tasks);
    }
  }

  async deleteTask(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].deleted = true;
      await this.storage.saveAll(this.STORAGE_KEY, this.tasks);
    }
  }

  async restoreTask(id: string): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].deleted = false;
      await this.storage.saveAll(this.STORAGE_KEY, this.tasks);
    }
  }

  async hardDeleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.storage.saveAll(this.STORAGE_KEY, this.tasks);
  }
}