"use client"

import MorphGallery from "@/components/integrations/21st/morph-gallery.component"

const ITEMS = [
  {
    src: "/integrations/21st/morph-gallery/image-01.jpg",
    thumb: "/integrations/21st/morph-gallery/image-02.jpg",
    alt: "Sun rays through a forest",
  },
  {
    src: "/integrations/21st/morph-gallery/image-03.jpg",
    thumb: "/integrations/21st/morph-gallery/image-04.jpg",
    alt: "Snow-capped mountain peak at night",
  },
  {
    src: "/integrations/21st/morph-gallery/image-05.jpg",
    thumb: "/integrations/21st/morph-gallery/image-06.jpg",
    alt: "Mountain reflected in a still lake",
  },
  {
    src: "/integrations/21st/morph-gallery/image-07.jpg",
    thumb: "/integrations/21st/morph-gallery/image-08.jpg",
    alt: "Aerial view of green hills",
  },
  {
    src: "/integrations/21st/morph-gallery/image-09.jpg",
    thumb: "/integrations/21st/morph-gallery/image-10.jpg",
    alt: "Orange wildflower field",
  },
  {
    src: "/integrations/21st/morph-gallery/image-11.jpg",
    thumb: "/integrations/21st/morph-gallery/image-12.jpg",
    alt: "Tropical beach with clear water",
  },
]

export default function Demo() {
  // w-full is load-bearing: 21st centres every demo inside a
  // `flex justify-center items-center` wrapper, and a flex item left at
  // width:auto shrinks to fit its contents — which, with a child asking for
  // 100%, resolves to 0px wide.
  return (
    <div className="relative w-full">
      <MorphGallery items={ITEMS} autoplay={4500} />
    </div>
  )
}


