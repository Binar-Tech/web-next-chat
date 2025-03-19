import { useEffect } from "react";
import { preloadImage } from "../_functions/preload-image";
interface ImageComponentProps {
  src: string;
  onClickImage: () => void;
}

const ImageComponent = ({ onClickImage, src }: ImageComponentProps) => {
  useEffect(() => {
    preloadImage(src);
  }, [src]);

  return (
    <div className="max-w-md flex items-center justify-center rounded-lg">
      <img
        src={src}
        alt="Preloaded"
        onClick={onClickImage}
        className="cursor-pointer rounded-lg"
      />
    </div>
  );
};

export default ImageComponent;
