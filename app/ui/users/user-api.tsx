'use server'
import { BASE_URL } from "@/app/lib/db";
import axios from "axios";
import { cookies } from "next/headers";
import {jwtDecode} from "jwt-decode";
import {z, ZodError } from "zod"
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


    // Création de l'objet JSON pour `registerRequest`
    const registerRequest = JSON.stringify({
      nom,
      prenom,
      contact,
      address,
      role,
      username,
      password
    });

    // Création du `FormData`
    const formDataToSend = new FormData();
    formDataToSend.append("registerRequest", registerRequest);
    if (image) {
      formDataToSend.append("file", image); // Ajoute l'image si elle existe
    }

    console.log('Données de la requête:', { registerRequest, image });

    const response = await axios.post(`${BASE_URL}/api/auth/register`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout:120000
    });

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data };
    } else {
      console.error('Erreur inattendue lors de la création:', response);
      return {
        success: false,
        error: 'Utilisateur non créé',
      };
    }

  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error('Validation échouée :', error.errors);
      return {
        success: false,
        error: 'Formulaire invalide, veuillez vérifier le formulaire'
      };
    }

    console.error('Erreur lors de la création de l\'utilisateur :', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}




export async function getAllUsers() {
  try {
    const tokenCookie = (await cookies()).get("token");

    if (!tokenCookie || !tokenCookie.value) {
      return { success: false, error: "Token introuvable ou invalide." };
    }

    const token = tokenCookie.value;

    let role = null;
    try {
      const decodedToken: any = jwtDecode(token);
      role = decodedToken?.role || null;
      console.log(role)
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
      return { success: false, error: "Token invalide." };
    }

    if (role !== "ADMIN") {
      return {
        success: false,
        error: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
      };
    }

    const response = await axios.get(`${BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);

    if (error.response?.status === 403) {
      return {
        success: false,
        error:
          "Vous n'avez pas les permissions nécessaires pour voir la liste des utilisateurs.",
      };
    }

    return { success: false, error: "Erreur lors du chargement des utilisateurs." };
  }
}

