import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import client from '../lib/db'

// Fonction pour semer les utilisateurs
async function seedUsers() {
  await client.connect();
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.query(`
        INSERT INTO users (id, name, email, password)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [user.id, user.name, user.email, hashedPassword]);
    }));
  } finally {
    await client.end();
  }
}

// Fonction pour semer les factures
async function seedInvoices() {
  await client.connect();
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `);

    await Promise.all(invoices.map((invoice) =>
      client.query(`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [invoice.customer_id, invoice.amount, invoice.status, invoice.date]),
    ));
  } finally {
    await client.end();
  }
}

// Fonction pour semer les clients
async function seedCustomers() {
  await client.connect();
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );
    `);

    await Promise.all(customers.map((customer) =>
      client.query(`
        INSERT INTO customers (id, name, email, image_url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO NOTHING;
      `, [customer.id, customer.name, customer.email, customer.image_url]),
    ));
  } finally {
    await client.end();
  }
}

// Fonction pour semer les revenus
async function seedRevenue() {
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `);

    await Promise.all(revenue.map((rev) =>
      client.query(`
        INSERT INTO revenue (month, revenue)
        VALUES ($1, $2)
        ON CONFLICT (month) DO NOTHING;
      `, [rev.month, rev.revenue]),
    ));
  } finally {
    await client.end();
  }
}

// Fonction principale pour semer toutes les tables
export async function GET() {
  try {
    await client.connect();
    await client.query('BEGIN');
    
    await seedRevenue();
    await seedInvoices();
    await seedUsers();
    await seedCustomers();
    
    
    await client.query('COMMIT');
    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during database seeding:', error);
    return new Response(JSON.stringify({ error: error || 'Une erreur s\'est produite' }), { status: 500 });
  } finally {
    await client.end();
  }
}
