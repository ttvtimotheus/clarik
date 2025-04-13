"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TabsCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  defaultValue: string
  title: string
  description?: string
  tabs: {
    value: string
    label: string
    content: React.ReactNode
  }[]
}

export function TabsCard({
  defaultValue,
  title,
  description,
  tabs,
  className,
  ...props
}: TabsCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <Tabs defaultValue={defaultValue}>
        <div className="px-6">
          <TabsList className="w-full mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <CardContent className="pt-0">
              {tab.content}
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
