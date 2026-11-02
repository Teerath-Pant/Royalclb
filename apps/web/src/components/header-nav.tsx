import { ChevronLeft } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/utils/cn";
import { back } from "@/utils/navigation";

export interface HeaderNavProps extends ComponentProps<"nav"> {
  title: string;
  onBack?: () => void;
  rightSlot?: ReactNode | null;
}

export function HeaderNav({
  title,
  onBack,
  rightSlot,
  className,
  ...props
}: HeaderNavProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      back();
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full bg-bg-header text-white shadow-md",
        className
      )}
      {...props}
    >
      <div className="relative flex h-12 items-center justify-between px-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center p-1 text-white hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6 stroke-[2.25]" />
        </button>

        <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-base font-bold tracking-wide text-white">
          {title}
        </h1>

        <div className="flex items-center">
          {rightSlot ?? <div className="w-8" aria-hidden="true" />}
        </div>
      </div>
    </nav>
  );
}
