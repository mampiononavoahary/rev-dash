'use server';

import {date, z} from 'zod';
import client from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { url } from 'inspector';


const formChema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending','paid']),
    date: z.string(),
});

const CreateInvoice = formChema.omit({id:true, date:true});

export async function createInvoice(formData:FormData){
    const {customerId,amount,status} = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // Test it out:
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  try {
    // Use parameterized query to avoid SQL injection
    await client.connect();
    const insert = await client.query(
        `INSERT INTO invoices (customer_id, amount, status, date) VALUES ($1, $2, $3, $4)`,
        [customerId, amountInCents, status, date]
    );

    // Revalidate and redirect
    //revalidatePath('/dashboard/invoices');
    if (insert) {
         return redirect("/dashboard/invoices?page=1");
    }else{
        return redirect("401");
    }
    //redirect('/dashboard/invoices'); 
} catch (error) {
    console.error("Error creating invoice:", error);
    // Handle error as needed, e.g., show error message or re-throw error
} 
}