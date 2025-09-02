interface Props {
  src: string;
  onClick: () => void;
}

export default function MessageImage({ src, onClick }: Props) {
  return (
    <img
      src={src}
      alt="Imagem"
      onClick={onClick}
      className="cursor-pointer rounded-lg"
    />
  );
}
