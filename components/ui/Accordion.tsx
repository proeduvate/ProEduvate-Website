"use client";

import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const idBase = useId();

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `${idBase}-panel-${i}`;
        const buttonId = `${idBase}-button-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-chalk hover:text-accent"
              >
                {item.question}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    isOpen && "rotate-180 text-accent"
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid overflow-hidden transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <p className="min-h-0 text-sm leading-relaxed text-gray-400">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
