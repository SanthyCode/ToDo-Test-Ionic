import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category';
import { Category } from '../../shared/models/category.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';

  constructor(
    private categoryService: CategoryService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: this.newCategoryName.trim()
    };

    await this.categoryService.addCategory(newCategory);
    this.newCategoryName = '';
    await this.loadCategories();
  }

  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
  }

  async editCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Nombre de la categoría'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.name.trim()) {
              category.name = data.name.trim();
              await this.categoryService.updateCategory(category);
              await this.loadCategories();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  trackById(index: number, item: Category): string {
    return item.id;
  }
}