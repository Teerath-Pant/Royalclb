import type { ComponentProps } from "react";

import { cn } from "../utils/cn";

type Props = ComponentProps<"div">;

export function Shell({ className, children, ...props }: Props) {
  return (
    <div
      className={cn(
        "max-w-102.5 w-full mx-auto bg-bg-page min-h-screen",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
