'use server'
import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers";
import { object, z, ZodError } from "zod"
const formSchema = z.object({
  nom: z.string().nonempty('nom requis'),
  prenom: z.string().nonempty('prenom requis'),
  contact: z.string(),
  address: z.string(),
  image: z.instanceof(File).optional(),
  role: z.string().nonempty('role requis'),
  username: z.string().nonempty('username requis'),
  password: z.string().nonempty('password requis')
});
export async function CreateUser(formdata: FormData) {
  try {
    const { nom, prenom, contact, address, image, role, username, password } = formSchema.parse({
      nom: formdata.get('nom'),
      prenom: formdata.get('prenom'),
      contact: formdata.get('contact'),
      address: formdata.get('address'),
      image: formdata.get('image'),
      role: formdata.get('role'),
      username: formdata.get('username'),
      password: formdata.get('password'),
    });

    const token = (await cookies()).get('token');

    if (!token || !token.value) {
      return { success: false, error: 'Token introuvable ou invalide.' };
    }


    const requestData = {
      nom,
      prenom,
      contact,
      address,
      image,
      role,
      username,
      password
    };

    console.log('Données de la requête:', requestData);

    const response = await axios.post(`${BASE_URL}/api/auth/register`, requestData, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      console.error('Erreur inattendue lors de la creation:', response);
      return {
        success: false,
        error: 'utilisateur non creer',
      };
    }

  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Validation échouée :', error.errors);
      return {
        success: false,
        error: 'formulaire invalides, Veuillez Vérifiez la formulaire'
      };
    }

    // Gère les autres erreurs
    console.error('Erreur lors de la création de la transaction :', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

