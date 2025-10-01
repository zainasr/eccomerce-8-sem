export const generateUsername = (
  firstName: string,
  lastName: string
): string => {
  const base = `${firstName}_${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  const randomSuffix = Math.floor(Math.random() * 9999) + 1;
  return `${base}_${randomSuffix}`;
};

export const generateUsernameFromEmail = (email: string): string => {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  const randomSuffix = Math.floor(Math.random() * 9999) + 1;
  return `${base}_${randomSuffix}`;
};
