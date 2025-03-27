import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  newProduct: any = { name: '', price: null, description: '' };
  editingProduct: any = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products. Please check if json-server is running.';
        this.isLoading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  addProduct(): void {
    if (!this.newProduct.name || this.newProduct.price === null) {
      this.errorMessage = 'Name and price are required';
      return;
    }

    this.isLoading = true;
    this.http.post<any>(this.apiUrl, this.newProduct).subscribe({
      next: (data) => {
        this.products.push(data);
        this.newProduct = { name: '', price: null, description: '' };
        this.isLoading = false;
        this.loadProducts(); 
      },
      error: (err) => {
        this.errorMessage = 'Failed to add product';
        this.isLoading = false;
        console.error('Error adding product:', err);
      }
    });
  }

  editProduct(product: any): void {
    this.editingProduct = { ...product };
  }

  updateProduct(): void {
    this.isLoading = true;
    this.http.put<any>(`${this.apiUrl}/${this.editingProduct.id}`, this.editingProduct)
      .subscribe({
        next: () => {
          this.loadProducts(); 
          this.editingProduct = null;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update product';
          this.isLoading = false;
          console.error('Error updating product:', err);
        }
      });
  }

  deleteProduct(id: number): void {
    this.isLoading = true;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.loadProducts(); 
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete product';
        this.isLoading = false;
        console.error('Error deleting product:', err);
      }
    });
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }
}