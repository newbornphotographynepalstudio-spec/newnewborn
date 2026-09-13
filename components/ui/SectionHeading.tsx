type Level = "h2" | "h3";

/**
 * The eyebrow + heading + optional description pattern repeated across
 * homepage sections. `level` controls the actual heading tag rendered —
 * callers are responsible for keeping exactly one `h1` per page and a
 * sane heading order (this is always h2/h3, never h1).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  align = "left",
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  level?: Level;
  align?: "left" | "center";
  tone?: "default" | "inverse";
}) {
  const Heading = level;
  const alignClass = align === "center" ? "mx-auto text-center" : "";
  const titleSize = level === "h2" ? "text-h2" : "text-h3";
  const toneEyebrow = tone === "inverse" ? "text-blush" : "text-taupe";
  const toneTitle = tone === "inverse" ? "text-white" : "";
  const toneDescription = tone === "inverse" ? "text-white/80" : "text-charcoal/80";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className={`text-eyebrow font-medium tracking-eyebrow uppercase ${toneEyebrow}`}>
          {eyebrow}
        </p>
      ) : null}
      <Heading className={`${eyebrow ? "mt-xs" : ""} ${titleSize} ${toneTitle}`}>{title}</Heading>
      {description ? (
        <p className={`mt-sm text-body-lg leading-relaxed ${toneDescription}`}>{description}</p>
      ) : null}
    </div>
  );
}
