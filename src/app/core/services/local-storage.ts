import { Injectable } from '@angular/core';
import { IStorageRepository } from '../interfaces/istorage.repository';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService<T> implements IStorageRepository<T> {
  async getAll(key: string): Promise<T[]> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  async saveAll(key: string, data: T[]): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }
}