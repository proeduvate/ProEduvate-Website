import Link from "next/link";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export interface JobCardBadge {
  label: string;
  tone?: "accent" | "neutral" | "success" | "warning" | "outline";
}

export function JobCard({
  title,
  tag,
  badges,
  location,
  postedAt,
  summary,
  href,
}: {
  title: string;
  tag: string;
  badges: JobCardBadge[];
  location: string;
  postedAt: string;
  summary: string;
  href: string;
}) {
  const formattedDate = new Date(postedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{tag}</Badge>
        {badges.map((badge) => (
          <Badge key={badge.label} tone={badge.tone ?? "accent"}>
            {badge.label}
          </Badge>
        ))}
      </div>

      <h3 className="mt-4 text-xl font-medium text-chalk">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {formattedDate}
        </span>
      </div>

      <Link
        href={href}
        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
      >
        View Role
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}
