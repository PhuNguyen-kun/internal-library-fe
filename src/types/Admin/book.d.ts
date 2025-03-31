export interface Book {
  id?: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  published_year: string;
  stock_quantity: number;
  page: number;
  short_description: string;
  description: string;
  image_url: string;
  additional_images: string;
  deleted_at?: string;
}

export interface Option {
  value: any;
  label: any;
}
