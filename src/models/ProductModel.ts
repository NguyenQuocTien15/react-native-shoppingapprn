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
  averageRating: number;
  selled: number;
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

