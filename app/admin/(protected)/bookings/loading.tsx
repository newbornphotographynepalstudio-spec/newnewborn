import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SkeletonTable } from "@/components/admin/ui/Skeleton";

export default function LoadingBookings() {
  return (
    <div>
      <PageHeader title="Bookings & Inquiries" description="Every enquiry submitted through /book-a-session/, newest first." />
      <SkeletonTable />
    </div>
  );
}
