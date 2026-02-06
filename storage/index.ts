// Web-compatible storage using localStorage
export const storage = {
  set: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  getString: (key: string): string | undefined => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) ?? undefined;
    }
    return undefined;
  },
};
