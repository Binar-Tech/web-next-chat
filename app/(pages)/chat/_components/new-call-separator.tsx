interface NewCallSeparadotProps {
  id_chamado: number;
}

export default function NewCallSeparator({
  id_chamado,
}: NewCallSeparadotProps) {
  return (
    <div className="flex justify-center m-10">
      <div className="bg-gray-600 text-white px-6 py-2 rounded-xl text-sm">
        Chamado #{id_chamado}
      </div>
    </div>
  );
}
