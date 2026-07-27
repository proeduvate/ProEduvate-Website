import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Product } from "@/data/products";

const statusTone = {
  Live: "success",
  Beta: "warning",
  "Coming Soon": "neutral",
} as const;

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 font-display text-base font-semibold text-accent">
          {product.initials}
        </div>
        <Badge tone={statusTone[product.status]}>{product.status}</Badge>
      </div>

      <h3 className="mt-5 text-xl font-medium text-chalk">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{product.tagline}</p>

      <div className="mt-6 flex items-center justify-between">
        <Badge tone="neutral">{product.category}</Badge>
        <Link
          href={product.externalUrl}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-accent"
        >
          View Product
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </Card>
  );
}
