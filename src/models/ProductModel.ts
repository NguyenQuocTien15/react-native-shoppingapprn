import { FileModel } from "./FileModel";

export class Product {
  id: string;
  type: string;
  description: string;
  price: number;
  title: string;
  imageUrl: string;
  files: string[];
  categories: string[];
  createdAt: number;
  updatedAt: number;
  rate: number;
  sold: number;
  brand: string;

  constructor(data: {
    id: string;
    type: string;
    description: string;
    price: number;
    title: string;
    imageUrl: string;
    files: string[];
    categories: string[];
    createdAt: number;
    updatedAt: number;
    rate: number;
    sold: number;
    brand: string;
  }) {
    this.id = data.id;
    this.type = data.type;
    this.description = data.description;
    this.price = data.price;
    this.title = data.title;
    this.imageUrl = data.imageUrl;
    this.files = data.files;
    this.categories = data.categories;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.rate = data.rate;
    this.sold = data.sold;
    this.brand = data.brand;
  }

  // Phương thức tính giảm giá cho sản phẩm
  applyDiscount(discountPercentage: number): number {
    return this.price - (this.price * discountPercentage) / 100;
  }

  // Phương thức cập nhật thông tin sản phẩm
  update(data: Partial<Product>) {
    Object.assign(this, data);
    this.updatedAt = Date.now(); // Cập nhật thời gian cập nhật mới
  }

  // Phương thức hiển thị thông tin cơ bản về sản phẩm
  getSummary(): string {
    return `${this.title} - ${this.description}`;
  }
}


export interface ProductModel {
  id: string;
  type: string;
  description: string;
  price: number;
  title: string;
  imageUrl: string;
  files: string[];
  categories: string[];
  createdAt: number;
  updatedAt: number;
  rate: number;
  sold: number;
  brand:string
}

export interface SubProduct {
  color: string;
  files: FileModel[];
  id: string;
  imageUrl: string;
  price: number;
  productId: string;
  size: string[];
  quantity: number;
}

