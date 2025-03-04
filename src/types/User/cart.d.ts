export interface CartItem {
  id: number;
  book: {
    id: number;
    stock_quantity: number;
    image_url: string;
    title: string;
    slug: string;
  };
  quantity: number;
  return_date_due: string;
}
