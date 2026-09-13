export function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="border-b border-taupe/20 pb-4">
      <p className="text-caption tracking-eyebrow text-taupe uppercase">{label}</p>
      <a
        href={href}
        className="mt-1 block text-h4 text-plum hover:text-charcoal break-words"
      >
        {value}
      </a>
    </div>
  );
}
