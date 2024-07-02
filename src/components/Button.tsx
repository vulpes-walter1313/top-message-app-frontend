import React from 'react'
import { cn } from '../lib/utils';

type ButtonProps = {
  as: "link" | "button";
  children: React.ReactNode | string;
  href: string;
  variant: "solid" | "outline"
}
export default function Button({as, children, href, variant}: ButtonProps) {
  let styles = "py-2 px-6";
  
  switch (variant) {
    case "solid":
      styles = cn(styles, "text-zinc-50 bg-emerald-500 font-semibold rounded-full text-lg");
      break;
    case "outline":
      styles = cn(styles, "text-emerald-500 border-2 border-emerald-500 font-semibold rounded-full text-lg");
      break;
    default:
      break;
  }
  if (as === "link") {
    return (
      <a href={href} className={styles}>{children}</a>
    )
  }
  return (
    <div>Button</div>
  )
}
