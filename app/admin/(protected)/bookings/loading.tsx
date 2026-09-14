export default function LoadingBookings() {
  return (
    <div className="mx-auto max-w-7xl px-gutter py-2xl">
      <h1 className="text-h2 text-plum">Bookings & Inquiries</h1>
      <p className="mt-2xs text-small text-charcoal/70">
        Every enquiry submitted through /book-a-session/, newest first.
      </p>
      <div className="mt-lg border border-taupe/20 bg-white p-lg text-small text-taupe">
        Loading bookings…
      </div>
    </div>
  );
}
