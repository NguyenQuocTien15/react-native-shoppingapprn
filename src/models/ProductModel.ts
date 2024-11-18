import { FileModel } from "./FileModel";
import { OfferModel } from "./OfferModel";

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
  offer?: OfferModel;


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
    offer?: OfferModel;

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
    this.offer = data.offer;

  }

   // Phương thức tính giá cuối cùng
   getDiscountedPrice(): number {
    if (this.offer && this.offer.percent) {
      return this.applyDiscount(this.offer.percent);
    }
    return this.price;
  }

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
  variations: any;
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
  averageRating: number;
  offer?:OfferModel;
  sold: number;

}

export interface SubProduct {
  color: string;
  files: FileModel[];
  id: string;
  imageUrl: string;
  price: string;
  productId: string;
  size: string[];
  quantity: number;
  offer?:OfferModel;
  sold: number;
  
}

