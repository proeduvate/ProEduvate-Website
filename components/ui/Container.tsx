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
    <Tag className={cn("mx-auto w-full max-w-[1280px] px-6 md:px-10", className)}>
      {children}
    </Tag>
  );
}
