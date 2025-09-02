interface Props {
  src: string;
}

export default function MessageVideo({ src }: Props) {
  return (
    <div className="w-[250px] h-[440px]">
      <video controls className="w-full h-full rounded-lg">
        <source src={src} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
    </div>
  );
}
