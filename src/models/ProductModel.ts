import { FileModel } from "./FileModel";

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
  rate: string;
  seller: number;
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
