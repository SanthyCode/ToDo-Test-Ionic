import { Injectable, Inject } from '@angular/core';
import { Category } from '../../shared/models/category.model';
import { IStorageRepository } from '../interfaces/istorage.repository';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories_data';
  private categories: Category[] = [];

  constructor(
    @Inject('IStorageRepository') private storage: IStorageRepository<Category>
  ) {
    this.init();
  }

  private async init() {
    this.categories = await this.storage.getAll(this.STORAGE_KEY);
  }

  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async addCategory(category: Category): Promise<void> {
    this.categories.push(category);
    await this.storage.saveAll(this.STORAGE_KEY, this.categories);
  }

  async updateCategory(updatedCategory: Category): Promise<void> {
    const index = this.categories.findIndex(c => c.id === updatedCategory.id);
    if (index > -1) {
      this.categories[index] = updatedCategory;
      await this.storage.saveAll(this.STORAGE_KEY, this.categories);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
    await this.storage.saveAll(this.STORAGE_KEY, this.categories);
  }
}