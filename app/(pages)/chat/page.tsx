export default function Chat() {
  return (
    <div className="flex w-full h-screen">
      {/* Lado esquerdo - 20% da largura total */}
      <div className="bg-slate-600 flex-[1] h-full min-w-96"></div>

      {/* Lado direito - 80% da largura total */}
      <div className="bg-blue-400 flex-[4] h-full"></div>
    </div>
  );
}
