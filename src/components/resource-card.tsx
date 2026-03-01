import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ResourceCardProps {
  icon: LucideIcon
  title: string
  description: string
  count: number
  href: string
}

export function ResourceCard({ icon: Icon, title, description, count, href }: ResourceCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{count} resources available</div>
        </CardContent>
      </Card>
    </Link>
  )
}

