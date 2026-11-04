import { getGallery } from "@/lib/api";
import GalleryHero from "./GalleryHero";
import GalleryExplorer from "./GalleryExplorer";

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <GalleryHero />
      <section id="gallery-list" className="scroll-mt-16 py-12">
        <div className="container mx-auto px-4">
          <GalleryExplorer items={items} />
        </div>
      </section>
    </>
  );
}