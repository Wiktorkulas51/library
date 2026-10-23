import {
  CircularGallery,
  type GalleryItem,
} from "@/components/integrations/21st/circular-gallery-2.component"; // Adjust this path to your component location

// Define the items to be passed as props
const galleryItems: GalleryItem[] = [
  { image: "/integrations/21st/circular-gallery-2/image-01.jpg", text: "Bridge" },
  {
    image: "/integrations/21st/circular-gallery-2/image-02.jpg",
    text: "Desk Setup",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-03.jpg",
    text: "Waterfall",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-04.jpg",
    text: "Strawberries",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-05.jpg",
    text: "Deep Diving",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-06.jpg",
    text: "Train Track",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-07.jpg",
    text: "Santorini",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-08.jpg",
    text: "Blurry Lights",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-09.jpg",
    text: "New York",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-10.jpg",
    text: "Good Boy",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-11.jpg",
    text: "Coastline",
  },
  {
    image: "/integrations/21st/circular-gallery-2/image-12.jpg",
    text: "Palm Trees",
  },
];

/**
 * Default demo for the CircularGallery.
 * It automatically adapts to light/dark mode text colors.
 */
export default function CircularGalleryDemo() {
  return (
    // A container is needed to define the gallery's size
    <div className="relative h-[600px] w-full rounded-lg">
      <CircularGallery
        items={galleryItems}
        bend={3}
        borderRadius={0.05}
        scrollEase={0.02}
      />
    </div>
  );
}

