'use client'
import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, ArrowRightCircleIcon, ArrowPathIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteCollecteur, UpdateProduitsCollecter } from "../collecteurs/collecteur-api";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "../button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_URL } from "@/app/lib/db";

export function CreateCollecteurs() {
  return (
    <Link
      href="/dashboard/collecteurs/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Ajouter Collecteur/Client Tantsaha</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCollecteur({ id_collecteur }: { id_collecteur: number }) {
  return (
    <Link
      href={`/dashboard/collecteurs/update/${id_collecteur}`}
      className="rounded-md border p-2 hover:bg-yellow-200"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}


export function UpdateProduitCollecter({
  id_produit_collecter,
  initialQuantite,
  initialUnite,
  initialPrix,
  onSuccess,
  updateList,
}: {
  id_produit_collecter: number;
  initialQuantite: number;
  initialUnite: string;
  initialPrix: number;
  onSuccess?: () => void;
  updateList: (updated: {
    id_produit_collecter: number;
    quantite: number;
    unite: string;
    prix_unitaire: number;
  }) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [quantite, setQuantite] = useState(initialQuantite);
  const [unite, setUnite] = useState(initialUnite);
  const [prixUnitaire, setPrixUnitaire] = useState(initialPrix);
  const [loading, setLoading] = useState(false);

  const handleAnnuler = () => {
    setShowForm(false);
    setQuantite(initialQuantite);
    setUnite(initialUnite);
    setPrixUnitaire(initialPrix);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await UpdateProduitsCollecter(id_produit_collecter, quantite, unite, prixUnitaire);
      if (onSuccess) onSuccess();
      updateList({
        id_produit_collecter,
        quantite,
        unite,
        prix_unitaire: prixUnitaire,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setLoading(false);
    }
  };
  if (!showForm) {
    return <PencilIcon className="w-4 cursor-pointer" onClick={() => setShowForm(true)} />;
  }

  return (
    <Card className="w-[350px]">
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="quantite">Quantité</Label>
            <Input
              id="quantite"
              type="number"
              placeholder="Quantité à transformer"
              value={quantite}
              onChange={(e) => setQuantite(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="unite">Unité</Label>
            <Select defaultValue={unite}>
              <SelectTrigger id="unite">
                <SelectValue placeholder={unite} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="KG">KG</SelectItem>
                <SelectItem value="T">T</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="prix_unitaire">Quantité</Label>
            <Input
              id="prix_unitaire"
              type="number"
              placeholder="Quantité à transformer"
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(Number(e.target.value))}
            />
          </div>        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="bg-teal-200 text-gray-900 hover:text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button
          onClick={handleAnnuler}
          className="bg-gray-500 text-gray-900 hover:bg-gray-800"
        >
          Annuler
        </Button>      </CardFooter>
    </Card>
  );
}


export function DeleteCollecteur({ id_collecteur, onDelete }: { id_collecteur: number, onDelete: () => void }) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await deleteCollecteur(id_collecteur);
      onDelete();
    } catch (error) {
      console.error("Erreur lors de la suppression du collecteur", error);
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className="rounded-md border p-2 hover:bg-red-300">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
export function Explorer({ id_collecteur }: { id_collecteur: number }) {

  return (<Link
    href={`/dashboard/collecteurs/${id_collecteur}`}
    className="relative group"
  >
    <button className="rounded-md border p-2 hover:bg-green-300">
      <span className="sr-only">Leur débit et crédit</span>
      <ArrowRightCircleIcon className="w-5" />
    </button>
  </Link>
  );
}
export function Effectuer({ id_collecteur }: { id_collecteur: number }) {
  return (<div
    className="relative group"
  >
    <button className="rounded-full border p-1 bg-green-300">
      <span className="sr-only">Leur débit et crédit</span>
      <CheckIcon className="w-5" />
    </button>
  </div>
  );
}
export function EnAttent({ id_collecteur }: { id_collecteur: number }) {
  return (<div
    className="relative group"
  >
    <button className="rounded-full border p-1 bg-yellow-300">
      <span className="sr-only">Leur débit et crédit</span>
      <ClockIcon className="w-5" />
    </button>
  </div>
  );
}
