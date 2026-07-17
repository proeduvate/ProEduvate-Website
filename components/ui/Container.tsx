import { createElement } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  // react-three-fiber augments the global JSX.IntrinsicElements namespace
  // with hundreds of three.js element tags, which breaks TS's inference for
  // `<Tag>` when Tag is a generic React.ElementType (the union of possible
  // prop/children shapes collapses to `never`). createElement isn't
  // affected by that JSX-specific checking.
  return createElement(
    Tag,
    { className: cn("mx-auto w-full max-w-[1280px] px-6 md:px-10", className) },
    children
  );
}
