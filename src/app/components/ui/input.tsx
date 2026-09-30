import * as React from "react";

import { cn } from "./utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
        flex h-12 w-full min-w-0
        rounded-xl
        border border-slate-200
        bg-white
        px-3 py-2
        text-sm text-slate-900
        placeholder:text-slate-400

        outline-none
        transition-all duration-200

        focus-visible:border-cyan-400
        focus-visible:ring-2
        focus-visible:ring-cyan-400/10

        file:inline-flex
        file:h-8
        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        file:text-slate-600

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        aria-invalid:border-red-500
        aria-invalid:ring-2
        aria-invalid:ring-red-500/10
        `,
        className
      )}
      {...props}
    />
  );
}

export { Input };