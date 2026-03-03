export interface IStorageRepository<T> {
  getAll(key: string): Promise<T[]>;
  saveAll(key: string, data: T[]): Promise<void>;
}