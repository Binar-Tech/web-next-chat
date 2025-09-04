export function canEditMessage(createdAt: string | Date): boolean {
  const messageTime = new Date(createdAt).getTime();
  const now = Date.now();
  const diffMinutes = (now - messageTime) / 1000 / 60;
  return diffMinutes < 15;
}
