'use server';

import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers";

export default async function getAllStock(){
  try {
    const token = (await cookies()).get('token');

    if (!token) {
      console.warn('Token not found');
    }
    const stocks = await axios.get(`${BASE_URL}/api/stocks`,{
      headers:{
        Authorization: `Bearer ${token?.value}`,
      },
    });
    const res = stocks.data;
    return res;
  } catch (error) {
    console.error('Error lors de la récupération des stocks');
    throw error;
  }
}
