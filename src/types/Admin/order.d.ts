export interface OrderDetail {
  id: number;
  title: string;
  image_url: string;
  return_date_due: string;
  return_date_real: string | null;
  status: string;
}

export interface Order {
  id?: number;
  status: string;
  created_at: string;
  full_name: string;
  employee_code: string;

  details?: OrderDetail[];
}
