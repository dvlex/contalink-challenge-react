export interface Invoice {
  id: number;
  invoice_number: string;
  total: number;
  invoice_date: string;
  status: string;
  active: boolean;
}
