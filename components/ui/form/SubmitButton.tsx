import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";

export function SubmitButton({
  children,
  disabled,
  className,
}: {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button type="submit" variant="primary" disabled={disabled} className={className}>
      {children}
    </Button>
  );
}
