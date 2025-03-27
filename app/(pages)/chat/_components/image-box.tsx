"use client";
import Image from "next/image";
import { useState } from "react";
import Loading from "./loading";
interface ImageComponentProps {
  src: string;
  onClickImage: () => void;
}

const ImageComponent = ({ onClickImage, src }: ImageComponentProps) => {
  // useEffect(() => {
  //   preloadImage(src);
  // }, [src]);
  const [loading, setLoading] = useState(true);
  return (
    <div className=" bg-blue-500 max-w-md flex items-center justify-center rounded-lg relative">
      {/* Imagem sempre renderizada */}
      <Image
        src={src}
        alt="Preloaded"
        onClick={onClickImage}
        className="cursor-pointer rounded-lg"
        width={400}
        height={400}
        priority
        onLoad={() => setLoading(false)}
        style={{
          opacity: loading ? 0 : 1, // Esconde a imagem até carregar
          transition: "opacity 0.3s ease-in-out",
          objectFit: "cover",
        }}
      />

      {/* Loading sobreposto enquanto a imagem não carrega */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600-100">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
