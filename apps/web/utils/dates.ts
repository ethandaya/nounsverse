export function formatAgo(ago: string) {
  let str = ago;
  if (str.includes("minutes")) {
    str = str.replace("minutes", "mins");
  }
  return str + " ago";
}
