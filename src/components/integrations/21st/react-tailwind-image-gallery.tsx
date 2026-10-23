
import React, { useState, useEffect } from 'react';
import { Gallery, ImageModal } from "@/components/integrations/21st/react-tailwind-image-gallery.component";

type GalleryImage = { id: number; src: string; alt: string; title: string; span: string };

const galleryData: GalleryImage[] = [
  {
    id: 1,
    src: "https://cdn.21st.dev/assets/mirror/f0/f0ad6f8f196e7ebe561e55da3e40d73664580316c8edd46313049382949f4f35.jpg",
    alt: "Cityscape at dusk",
    title: "Cityscape at dusk",
    span: "col-span-1"
  },
  {
    id: 2,
    src: "https://cdn.21st.dev/assets/mirror/e4/e46f17fa42139064cce009d6262103f44d99e7278b2221833dff4d93f4620420.jpg",
    alt: "Portrait",
    title: "Portrait",
    span: "sm:col-span-2"
  },
  {
    id: 3,
    src: "https://cdn.21st.dev/assets/mirror/ec/eca033d2f8cf0e6aca823edae91610df5c9de3065eaa88ecbd82c49ec8fb3755.jpg",
    alt: "Sunlight through a forest",
    title: "Forest Path",
    span: "col-span-1"
  },
  {
    id: 4,
    src: "https://cdn.21st.dev/assets/mirror/30/30b39233ae39b2de1a4d18f58af96fab055e1d05761c39df256379d7a0d80ae0.jpg",
    alt: "Portrait of a person",
    title: "Portrait",
    span: "col-span-1"
  },
  {
    id: 5,
    src: "https://cdn.21st.dev/assets/mirror/80/800069f818d269b0c35a978eed1a7059f58b6d1df0c755df70875a175fea34ee.jpg",
    alt: "Wildlife photography",
    title: "Wildlife",
    span: "sm:col-span-2"
  },
  {
    id: 6,
    src: "https://cdn.21st.dev/assets/mirror/46/46e40c9f6260f1e78d774c27886bb83a01f810d395b2e1257de7982be9f59888.png",
    alt: "Modern architecture",
    title: "Architecture",
    span: "col-span-1"
  },
  {
    id: 7,
    src: "https://cdn.21st.dev/assets/mirror/75/7553e52815ba1ade083bb05ae0ae1b1151aeb1d53837c96ad5f9cfd151acff70.jpg",
    alt: "Starry night sky",
    title: "Night Sky",
    span: "col-span-1"
  },
  {
    id: 8,
    src: "https://cdn.21st.dev/assets/mirror/46/4630da586bc9f5570ee285ab144f1368c7f57fde75df16ab6e485738b02fe7a0.png",
    alt: "Street art",
    title: "Street Art",
    span: "col-span-1"
  },
  {
    id: 9,
    src: "https://cdn.21st.dev/assets/mirror/e3/e3509285a905a641c022c81368d266715c5ad93e302f85b3e3524a86516dcf73.jpg",
    alt: "Mountain Range",
    title: "Mountain Range",
    span: "sm:col-span-2"
  },
];

export default function DemoOne() {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const openModal = (src: string) => setModalImage(src);
  const closeModal = () => setModalImage(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Gallery data={galleryData} onImageClick={openModal} />
      <ImageModal src={modalImage} onClose={closeModal} />
    </>
  );
}

