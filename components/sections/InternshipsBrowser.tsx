"use client";

import { useMemo, useState } from "react";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { JobCard } from "@/components/sections/JobCard";
import { Button } from "@/components/ui/Button";
import type { InternshipListing } from "@/data/types";

const locationOptions = ["All", "Remote", "On-site", "Hybrid"];

export function InternshipsBrowser({ internships }: { internships: InternshipListing[] }) {
  // Derived from the data rather than a module constant, so the filter
  // reflects whatever the API actually returned.
  const trackOptions = ["All", ...Array.from(new Set(internships.map((i) => i.track)))];
  const [track, setTrack] = useState("All");
  const [location, setLocation] = useState("All");

  const filtered = useMemo(() => {
    return internships.filter((role) => {
      const trackMatch = track === "All" || role.track === track;
      const locationMatch = location === "All" || role.locationType === location;
      return trackMatch && locationMatch;
    });
  }, [track, location, internships]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FilterSelect label="Track" value={track} onChange={setTrack} options={trackOptions} />
        <FilterSelect
          label="Location"
          value={location}
          onChange={setLocation}
          options={locationOptions}
        />
      </div>

      {filtered.length > 0 ? (
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((role) => (
            <AnimatedReveal key={role.id} className="h-full">
              <JobCard
                title={role.title}
                tag={role.track}
                badges={[
                  { label: role.duration, tone: "accent" },
                  { label: role.stipend, tone: "success" },
                ]}
                location={`${role.location} · ${role.locationType}`}
                postedAt={role.postedAt}
                summary={role.summary}
                href={`/internships/${role.id}`}
              />
            </AnimatedReveal>
          ))}
        </Stagger>
      ) : (
        <div className="mt-14 rounded-2xl border border-white/10 bg-surface-2 p-10 text-center">
          <p className="text-lg font-medium text-chalk">No internships match your filters.</p>
          <p className="mt-2 text-sm text-gray-400">
            New tracks open regularly — check back soon or reach out directly.
          </p>
          <div className="mt-6">
            <Button href="mailto:careers@proeduvate.in" variant="secondary" className="border border-white/10">
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
