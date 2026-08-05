import { cn } from "@/lib/utils";

// Narrowed to real HTML tags rather than React.ElementType: @react-three/fiber
// augments the global JSX namespace, which widens ElementType to include
// three.js elements whose `children` type is `never`.
type ContainerTag = "div" | "section" | "article" | "main" | "aside" | "header" | "footer" | "ul";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: ContainerTag;
}) {
  return (
    // The cap grows with the viewport instead of stopping dead at 1280px.
    // A fixed 1280 left ~320px of empty gutter per side on a 1920 display and
    // ~640px on a 2560 one, which reads as the layout failing to fill the
    // screen rather than as a deliberate measure.
    <Tag
      className={cn(
        "mx-auto w-full max-w-[1280px] px-6 md:px-10 xl:max-w-[1440px] 2xl:max-w-[1680px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
