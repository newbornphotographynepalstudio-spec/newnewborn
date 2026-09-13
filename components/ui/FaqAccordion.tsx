import type { FaqItem } from "@/lib/faq/types";

/** Native <details>/<summary> — accessible, no custom JS needed. Shared
 * by every page that shows a FAQ list (service pages, /faq/, homepage). */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-taupe/20 border-t border-b border-taupe/20">
      {items.map((item) => (
        <details key={item.id} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-body-lg text-charcoal marker:content-none">
            {item.question}
            <span
              aria-hidden
              className="shrink-0 text-plum transition-transform duration-base group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-small leading-relaxed text-charcoal/75">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
