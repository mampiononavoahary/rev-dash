
"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { lusitana } from "@/app/ui/fonts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getPicBuyTransactions } from "./getAllGeneralPage"

// Configuration des couleurs du graphique
const chartConfig = {
  sum: {
    label: "Sum",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Fonction pour convertir le mois en un numéro (January = 1, February = 2, ...)
const monthToNumber = (month: string) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  return months.indexOf(month.trim()) + 1
}

export default function RevenueChart() {
  const [chartData, setChartData] = useState<any[]>([])
  const [trend, setTrend] = useState<string>("")
  const [percentage, setPercentage] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPicBuyTransactions();

        console.log("Données brutes:", JSON.stringify(data, null, 2));

        // Transformation des données pour correspondre au format attendu
        const formattedData = data.map((item: any) => ({
          month: item.month.trim(), // Retirer les espaces superflus
          sum: item.sum,
          monthNumber: monthToNumber(item.month),
        }))

        console.log("Données formattedData:", JSON.stringify(formattedData, null, 2));

        // Trier les données par numéro de mois
        const sortedData = formattedData.sort((a: any, b: any) => a.monthNumber - b.monthNumber)

        console.log("Données sorter:", JSON.stringify(sortedData, null, 2));

        // Mettre à jour l'état avec les données triées
        setChartData(sortedData)        // Calculer la tendance et le pourcentage de variation
        if (formattedData.length > 1) {
          const lastMonthData = formattedData[formattedData.length - 2]
          console.log("Données du mois précédent :", JSON.stringify(lastMonthData, null, 2));
          const currentMonthData = formattedData[formattedData.length - 1]
          console.log("Données du mois actuel :", JSON.stringify(currentMonthData, null, 2));

          const previousMonthSum = lastMonthData.sum
          console.log(previousMonthSum)
          const currentMonthSum = currentMonthData.sum
          console.log(currentMonthSum)
          if (currentMonthSum > previousMonthSum) {
            setTrend("up")
            const changePercentage = ((currentMonthSum - previousMonthSum) / previousMonthSum) * 100
            console.log(changePercentage);
            setPercentage(changePercentage)
          } else {
            setTrend("down")
            const changePercentage = ((previousMonthSum - currentMonthSum) / previousMonthSum) * 100
            setPercentage(changePercentage)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
        Bilan de vente
      </h2>
      <Card className="rounded-xl w-full mt-4">
        <CardHeader>
          <CardTitle>Area Chart - Stacked</CardTitle>
          <CardDescription>
            Affichage du somme total du vente par mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="w-full h-[300px]" config={chartConfig}>
            <AreaChart
              data={chartData}
              width={undefined} // Adapte à la largeur du conteneur parent
              height={500} // Hauteur fixe
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="sum"
                type="natural"
                fill="var(--color-mobile)"
                fillOpacity={0.4}
                stroke="var(--color-sum)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {trend === "up" ? (
                  <>
                    Tendance en hausse de {percentage.toFixed(2)}% ce mois-ci{" "}
                    <TrendingUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Tendance en baisse de {percentage.toFixed(2)}% ce mois-ci{" "}
                    <TrendingDown className="h-4 w-4" />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - June 2024
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

