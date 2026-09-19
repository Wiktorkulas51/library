import * as React from "react"

import { cn } from "@/lib/utils"

export type PhosphorIconProps = React.HTMLAttributes<HTMLElement> & {
  name: string
  weight?: "regular" | "bold" | "fill" | "thin" | "light" | "duotone"
  size?: string | number
}

/**
 * React counterpart of atoms/Icon.astro.
 * React UI components and Astro blocks share the same Phosphor icon family
 * without adding a second icon library to the starter.
 */
function PhosphorIcon({
  name,
  weight = "regular",
  size,
  className,
  style,
  ...props
}: PhosphorIconProps) {
  const iconName = name.replace(/^ph-/, "")
  const weightClass = weight === "regular" ? "ph" : `ph-${weight}`
  const fontSize = typeof size === "number" ? `${size}px` : size

  return (
    <i
      {...props}
      className={cn(weightClass, `ph-${iconName}`, className)}
      style={fontSize ? { ...style, fontSize } : style}
    />
  )
}

export { PhosphorIcon }
