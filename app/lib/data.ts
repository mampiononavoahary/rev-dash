import { sql, createClient } from '@vercel/postgres';
import axios from 'axios';
import client, { BASE_URL } from '../lib/db';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { useAuth } from './userContext';

// Exemple pour fetchRevenue
export async function fetchRevenue() {
  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await client.query('SELECT * FROM revenue');
     
     console.log('Data fetch completed after 3 seconds.');
    if (!data.rows) {
      throw new Error('Aucune donnée retournée par la requête de revenus.');
    }
    return data.rows;
  } catch (error) {
    console.error('Erreur de base de données :', error); // Enregistre l'objet d'erreur complet
    console.error('Pile d\'erreur :', error); // Enregistre la pile d'erreur pour plus de détails
    throw new Error('Échec de la récupération des données de revenus.');
  }
}

// Des changements similaires peuvent être apportés à fetchLatestInvoices


export async function fetchLatestInvoices() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const data = await client.query(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`);
    
    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  } 
}

export async function fetchCardData() {

  try {

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const invoiceCountPromise = client.query(`SELECT COUNT(*) FROM invoices`);

    const customerCountPromise = client.query(`SELECT COUNT(*) FROM customers`);

    const invoiceStatusPromise = client.query(`SELECT

         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",

         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"

         FROM invoices`);


    const data = await Promise.all([

      invoiceCountPromise,

      customerCountPromise,

      invoiceStatusPromise,

    ]);


    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');

    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');

    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');

    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');


    return {

      numberOfCustomers,

      numberOfInvoices,

      totalPaidInvoices,

      totalPendingInvoices,

    };

  } catch (error) {

    console.error('Database Error:', error);

    throw new Error('Failed to fetch card data.');

  }

}


const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const invoices = await client.query(`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE $1 OR
        customers.email ILIKE $1 OR
        invoices.amount::text ILIKE $1 OR
        invoices.date::text ILIKE $1 OR
        invoices.status ILIKE $1
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `, [`%${query}%`]);
    

    if (!invoices.rows) {
      throw new Error('Aucune donnée retournée par la requête de revenus.');
    }
    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
}
}

export async function fetchInvoicesPages(query: string) {
  try {

    const count = await client.query(`
    SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE $1 OR
      customers.email ILIKE $1 OR
      invoices.amount::text ILIKE $1 OR
      invoices.date::text ILIKE $1 OR
      invoices.status ILIKE $1
    `,[`%${query}%`]);

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  } 
}

export async function fetchInvoiceById(id: string) {
  const client = createClient(); // Create a new client instance
  await client.connect(); // Connect to the database

  try {
    const data = await client.query(`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `);

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {

  try {
    const data = await client.query(`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `);

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
}
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await client.query(`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
          customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `);

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
}
}
const invoiceCountPromise = await client.query(`SELECT COUNT(*) FROM invoices`);
const customerCountPromise = await client.query(`SELECT COUNT(*) FROM customers`);
