'use server';

import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers";
import { number, string, z, ZodError } from "zod";

export async function GetAllPret() {
  try {
    const token = (await cookies()).get('token');

    if (!token) {
      console.error('Token introuvable dans le cookies');
      return;
    }
    const allPret = await axios.get(`${BASE_URL}/api/extract/pret-bancaire`, {
      headers: {
        "Authorization": `Bearer ${token.value}`,
      },
    })
    if (!allPret) {
      return { succes: false, error: "Error lors de la recupération des listes des prêts bancaire" }
    }
    return allPret.data;
  } catch (error) {
    console.error("Error lors de la recupération des prêts bancaire", error);
    return {
      succes: false,
      error: "Error lors du chargement des prêts bancaire"
    };
  }
}

const formSchema = z.object({
  dateDePret: z.string().nonempty("Date requise"),
  produit: z.coerce.number().nonnegative("Produit requis"),
  quantite: z.coerce.number().min(1, "Quantité invalide"),
  unite: z.string().nonempty("Unité requise"),
  prixUnitaire: z.coerce.number().min(50, "Prix invalide"),
  tauxAugmentation: z.coerce.number().min(0),
  tauxMensuel: z.coerce.number().min(0),
  dateDeRemboursement: z.string().nonempty("Date requise"),
});

export async function savePret(data: any) {
  try {
    const validatedData = formSchema.parse(data);

    const token = (await cookies()).get("token");

    if (!token) {
      console.error("Token introuvable dans les cookies");
    }
    const addPret = await axios.post(`${BASE_URL}/api/pret-bancaire/save`, validatedData, {
      headers: {
        Authorization: `Bearer ${token?.value}`,
        'Content-Type': 'application/json',
      }
    })
    if (addPret.status === 201 || addPret.status === 200) {
      return { success: true, data: addPret.data };
    } else {
      return { success: false, error: 'Erreur lors de la création de la transaction.' };
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Erreur de validation des données.' };
    }

    return {
      success: false,
      error: error.addPret?.data?.message || error.message,
    };
  }
}
