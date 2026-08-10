"use client";

import { useMemo, useState } from "react";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { JobCard } from "@/components/sections/JobCard";
import { Button } from "@/components/ui/Button";
import type { JobListing } from "@/data/types";

const employmentOptions = ["All", "Full-time", "Part-time"];
const locationOptions = ["All", "Remote", "On-site", "Hybrid"];

export function CareersBrowser({ jobs }: { jobs: JobListing[] }) {
  // Derived from the data rather than a module constant, so the filter
  // reflects whatever the API actually returned.
  const departmentOptions = ["All", ...Array.from(new Set(jobs.map((j) => j.department)))];
  const [employment, setEmployment] = useState("All");
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const employmentMatch =
        employment === "All" ||
        (employment === "Full-time" && job.employmentType === "full-time") ||
        (employment === "Part-time" && job.employmentType === "part-time");
      const departmentMatch = department === "All" || job.department === department;
      const locationMatch = location === "All" || job.locationType === location;
      return employmentMatch && departmentMatch && locationMatch;
    });
  }, [employment, department, location, jobs]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FilterSelect
          label="Employment Type"
          value={employment}
          onChange={setEmployment}
          options={employmentOptions}
        />
        <FilterSelect
          label="Department"
          value={department}
          onChange={setDepartment}
          options={departmentOptions}
        />
        <FilterSelect
          label="Location"
          value={location}
          onChange={setLocation}
          options={locationOptions}
        />
      </div>

      {filtered.length > 0 ? (
        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((job) => (
            <AnimatedReveal key={job.id} className="h-full">
              <JobCard
                title={job.title}
                tag={job.department}
                badges={[
                  {
                    label: job.employmentType === "full-time" ? "Full-Time" : "Part-Time",
                    tone: job.employmentType === "part-time" ? "warning" : "accent",
                  },
                ]}
                location={`${job.location} · ${job.locationType}`}
                postedAt={job.postedAt}
                summary={job.summary}
                href={`/careers/${job.id}`}
              />
            </AnimatedReveal>
          ))}
        </Stagger>
      ) : (
        <div className="mt-14 rounded-2xl border border-white/10 bg-surface-2 p-10 text-center">
          <p className="text-lg font-medium text-chalk">No roles match your filters.</p>
          <p className="mt-2 text-sm text-gray-400">
            Don&apos;t see the right fit? Send us your resume anyway.
          </p>
          <div className="mt-6">
            <Button href="mailto:careers@proeduvate.in" variant="secondary" className="border border-white/10">
              Send General Application
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
