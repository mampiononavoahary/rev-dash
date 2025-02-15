
"use client"

import * as React from "react"
import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStockByLieuAndProduit2, updateQuantiteStock } from "@/app/ui/stock/get-stock"
import { getIdAndName } from "@/app/ui/produits/getproduits"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

// Import des composants d'AlertDialog (adaptez le chemin et les noms selon votre configuration)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Page({ params }: { params: Promise<{ lieu_stock: string; nom_produit: string }> }) {
  const { lieu_stock, nom_produit } = use(params)
  const formattedNomProduit = decodeURIComponent(nom_produit)
  const router = useRouter()

  const [stocks, setStocks] = useState<{ id_stock: string; quantite_stock: number; unite: string } | null>(null)
  const [produits, setProduits] = useState<{ id_produit: string; nom_detail: string }[]>([])
  const [quantiteTransform, setQuantiteTransform] = useState("")
  const [error, setError] = useState("")
  const [quantiteStock, setQuantiteStock] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const stockData = await getStockByLieuAndProduit2(lieu_stock, nom_produit)
      const produitsData = await getIdAndName()
      setStocks(stockData)
      setProduits(produitsData)
    }
    fetchData()
  }, [lieu_stock, nom_produit])

  // Synchroniser l'état quantiteStock avec la donnée récupérée
  useEffect(() => {
    if (stocks) {
      setQuantiteStock(stocks.quantite_stock.toString())
    }
  }, [stocks])

  const handleQuantiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantiteTransform(value)
    if (stocks && parseFloat(value) > stocks.quantite_stock) {
      setError("La quantité dépasse la quantité en stock !")
    } else {
      setError("")
    }
  }

  const handleQuantiteStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantiteStock(e.target.value)
  }

  // Cette fonction est appelée lorsque l'utilisateur confirme la mise à jour dans le dialog
  const handleUpdateStock = async () => {
    if (!stocks) return
    setIsLoading(true)
    try {
      await updateQuantiteStock(stocks.id_stock, Number(quantiteStock))
      toast.success("Quantité mise à jour avec succès !")
      setAlertOpen(false) // Ferme l'alert dialog
      router.push("/dashboard/stock")
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la mise à jour de la quantité")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid justify-center gap-6 mt-6">
      <h1 className="flex justify-center text-xl font-bold">Mettre à jour le stock</h1>

      {/* Formulaire de mise à jour */}
      {stocks && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-green-800">{formattedNomProduit}</CardTitle>
            <CardDescription className="text-blue-400">
              Changer la quantité et l'unité de ce produit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="quantite-update">Quantité</Label>
                <Input
                  id="quantite-update"
                  type="number"
                  value={quantiteStock}
                  onChange={handleQuantiteStockChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="unite-update">Unité</Label>
                <Select defaultValue={stocks.unite}>
                  <SelectTrigger id="unite-update">
                    <SelectValue placeholder={stocks.unite} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="KG">KG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {/* AlertDialog enveloppe le bouton pour déclencher l'alert */}
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isLoading}
                  className="bg-teal-200 text-gray-900 hover:text-white flex items-center justify-center px-4 py-2"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      Chargement...
                    </div>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de mettre à jour le stock ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va mettre à jour le stock avec la nouvelle quantité.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleUpdateStock}
                    className="bg-red-400 hover:bg-red-600"
                  >
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      )}

      {/* Formulaire de transformation */}
      {stocks && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>{formattedNomProduit}</CardTitle>
            <CardDescription className="text-blue-400">Transformation des produits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="quantite-transform">Quantité</Label>
                <Input
                  id="quantite-transform"
                  type="number"
                  placeholder="Quantité à transformer"
                  value={quantiteTransform}
                  onChange={handleQuantiteChange}
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="unite-transform">Unité</Label>
                <Select defaultValue={stocks.unite}>
                  <SelectTrigger id="unite-transform">
                    <SelectValue placeholder={stocks.unite} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="KG">KG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="produit">Produit fini</Label>
                <Select>
                  <SelectTrigger id="produit">
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {produits.map((produit: any) => (
                      <SelectItem key={produit.id_produit_avec_detail} value={produit.nom_detail}>
                        {produit.nom_detail}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button className="bg-teal-200 text-gray-900 hover:text-white">Transformer</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

