const TOKEN_KEY = "***";
const EMAIL_KEY = "***";
const NAME_KEY = "***";

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  getEmail: (): string | null => localStorage.getItem(EMAIL_KEY),
  setEmail: (email: string) => localStorage.setItem(EMAIL_KEY, email),

  getName: (): string | null => localStorage.getItem(NAME_KEY),
  setName: (name: string) => localStorage.setItem(NAME_KEY, name),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NAME_KEY);
  },
};
