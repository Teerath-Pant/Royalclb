import type { ComponentProps } from "react";
import { Link as RouterLink } from "wouter";

export type LinkProps = ComponentProps<"a"> & { href: string };

export function Link({ href, ...props }: LinkProps) {
  return <RouterLink href={href} {...props} />;
}
