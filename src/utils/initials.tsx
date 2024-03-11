export default function getInitials(name: string | undefined): string {
  if (!name) {
    return '';
  }
  const words = name.split(' ');
  let initials = '';

  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials += words[i][0].toUpperCase();
    }
  }

  return initials.slice(0, 2);
}
