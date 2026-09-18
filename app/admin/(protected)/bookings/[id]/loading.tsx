import { Skeleton } from "@/components/admin/ui/Skeleton";
import { Card } from "@/components/admin/ui/Card";

export default function LoadingBookingDetail() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-7 w-56" />
      <Skeleton className="mt-2 h-3.5 w-40" />
      <div className="mt-6 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-3.5 w-full" />
            <Skeleton className="mt-2 h-3.5 w-2/3" />
          </Card>
        ))}
      </div>
    </div>
  );
}
