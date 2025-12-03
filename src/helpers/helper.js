export function abbrName(name) {
  const names = name.split(" ");
  let allowed = 20;
  allowed = name[0].length > 10 ? 0 : allowed - name.length;

  const initials =
    names[0] +
    names
      .map((n, idx) => {
        if (idx > 0) {
          if (n.length <= allowed) {
            allowed = allowed - n.length;
            return n;
          }
          return n[0]?.toUpperCase() + ".";
        } else {
          return "";
        }
      })
      .join(" ");

  return initials;
}

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
