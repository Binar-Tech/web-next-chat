export const getFileType = (nome_arquivo: string): string | null => {
  if (!nome_arquivo) return null;
  const ext = nome_arquivo.split(".").pop()?.toLowerCase();

  if (ext) {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "mkv", "flv"];
    const documentExtensions = ["pdf", "txt", "doc", "docx", "xls", "xlsx"];

    if (imageExtensions.includes(ext)) return "imagem";
    if (videoExtensions.includes(ext)) return "video";
    if (documentExtensions.includes(ext)) return "arquivo";
  }
  return "other";
};
