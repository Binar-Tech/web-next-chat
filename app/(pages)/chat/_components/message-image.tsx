type Props = {
  src: string;
  onClick?: () => void;
};

export default function MessageImage({ src, onClick }: Props) {
  return (
    <img
      src={src}
      alt="Imagem"
      onClick={onClick}
      className="cursor-pointer rounded-lg min-w-60 max-h-64 object-contain"
    />
  );
}
