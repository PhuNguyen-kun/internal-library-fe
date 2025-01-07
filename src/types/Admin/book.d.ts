export interface Book {
  id?: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  stock_quantity: number;
  page: number;
  short_description: string;
  description: string;
  image_url: string;
  additional_images: string;
}

export interface Option {
  value: any;
  label: any;
}
