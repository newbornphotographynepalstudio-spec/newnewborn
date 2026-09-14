import { EditorialGrid } from "@/components/primitives/EditorialGrid";
import { Section } from "@/components/primitives/Section";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedMediaByCategory } from "@/lib/media/library-data";
import type { MediaLibraryCategory } from "@/lib/media/library-types";

/**
 * Renders published Media Library photos for one portfolio category, in
 * a simple responsive grid, below whatever hand-tuned editorial layout
 * the page already has. Renders nothing (not even the heading) when no
 * media is published for this category yet — this section is purely
 * additive, so a category with no uploads looks exactly like it did
 * before this existed. This is the mechanism that lets an admin upload
 * make a real difference on the public site without a code change: the
 * category assigned at upload time is the only thing that decides
 * whether a photo shows up here.
 */
export async function MediaGallerySection({ category }: { category: MediaLibraryCategory }) {
  const assets = await getPublishedMediaByCategory(category);
  if (assets.length === 0) return null;

  return (
    <Section tone="ivory">
      <SectionHeading eyebrow="Recently Added" title="More from the studio" />
      <EditorialGrid className="mt-12">
        {assets.map((asset, index) => (
          <div key={asset.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Reveal delay={index * 50}>
              <EditorialImage src={asset.url} alt={asset.alt} aspect="square" rounded />
            </Reveal>
          </div>
        ))}
      </EditorialGrid>
    </Section>
  );
}
