
"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { lusitana } from "../fonts";
import { getStockRemaining } from "./getAllGeneralPage";

// Définition des types pour assurer un bon typage TypeScript
type LigneStock = {
  quantite: number;
  produit: string;
};

type StockData = {
  lieu_stock: string;
  ligne_stock: LigneStock[];
};

type TransformedData = {
  lieu_stock: string;
  [produit: string]: number | string;
};

// Configuration du chart
const chartConfig: Record<string, { label: string; color: string }> = {
  default: { label: "Quantité", color: "hsl(var(--chart-1))" },
};

export function StockRestantChart() {
  const [chartData, setChartData] = useState<TransformedData[]>([]);

  useEffect(() => {
    async function fetchStockData(): Promise<void> {
      try {
        const stockData: StockData[] = await getStockRemaining();
        console.log("Stock Data (from API):", stockData);

        if (stockData) {
          // Récupérer tous les produits pour assurer une cohérence des clés
          const allProducts = new Set<string>();
          stockData.forEach(({ ligne_stock }) =>
            ligne_stock.forEach(({ produit }) => allProducts.add(produit))
          );

          // Transformer les données pour recharts
          const transformedData: TransformedData[] = stockData.map(({ lieu_stock, ligne_stock }) => {
            const dataEntry: TransformedData = { lieu_stock };
            allProducts.forEach((produit) => {
              const item = ligne_stock.find((item) => item.produit === produit);
              dataEntry[produit] = item ? item.quantite : 0; // Assurer que tous les produits sont présents
            });
            return dataEntry;
          });

          console.log("Transformed Data (for Chart):", transformedData);
          setChartData(transformedData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stocks.", error);
      }
    }
    fetchStockData();
  }, []);

  return (
    <div>
      <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
        Stock restant par point de vente
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Stock restant en <span className="font-bold text-blue-800">KG</span>- Diagramme</CardTitle>
          <CardDescription>Grouper par point de vente</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="w-full h-[300px]" config={chartConfig}>
            <BarChart data={chartData} width={600} height={300}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lieu_stock" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
              <Legend />
              {chartData.length > 0 &&
                Object.keys(chartData[0]).map((key: string, index: number) => {
                  if (key !== "lieu_stock") {
                    return (
                      <Bar
                        key={index}
                        dataKey={key}
                        fill={`hsl(var(--chart-${index % 10 + 1}))`}
                        radius={4}
                      />
                    );
                  }
                  return null;
                })}
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            Stock restant par point de vente
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

