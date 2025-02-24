// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};
export type transactionTotal = {
  total: number,
}

export interface Transaction {
  id_transaction: string;
  nom_client: string;
  nom_produit: string;
  date_transaction: string;
  lieu_transaction?: string; // Optional field
  quantite: number;
  unite: string;
  status: string;
}
export interface stock{
  id_stock:number;
  lieu_stock:string;
  quantite_stock:number;
  unite:string;
  nom_detail:string;
  symbole:string;
  image_url:string;
}
export interface stockDetail{
  id_stock:number;
  lieu_stock:string;
  quantite_stock:number;
  uite_stock:string;
  nom_detail:string;
  quantite:number;
  unite:string;
  status:string;
  typeDeTransaction:string;
  lieuDeTransaction:string;
  date_transaction:string;
  nom_client:string;
}
export interface Clients {
  id_client: string;
  nom: string;
  prenom:string;
  total_transaction:number;
  total_vente:number;
  total_vente_paye:number;
  total_vente_en_attente:number;
  total_achat:number;
  total_achat_paye:number;
  total_achat_en_attente:number;
 }
export interface Vente {
  id_transaction: string;
  nom_client: string;
  nom_produit: string;
  date_transaction: string;
  lieu_transaction?: string; // Optional field
  quantite: number;
  unite: string;
  status: string;
}
export interface Achat {
  id_transaction: string;
  nom_client: string;
  nom_produit: string;
  date_transaction: string;
  lieu_transaction?: string; // Optional field
  quantite: number;
  unite: string;
  status: string;
}

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
