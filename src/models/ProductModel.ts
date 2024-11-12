import { FileModel } from "./FileModel";

export interface ProductModel {
  id: string;
  type: string;
  description: string;
  price: string;
  title: string;
  imageUrl: string;
  files: string[];
  categories: string[];
  createdAt: number;
  updatedAt: number;
  averageRating: number;
  selled: number;
  brand:string
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
}
