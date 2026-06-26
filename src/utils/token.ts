const TOKEN_KEY = "token";
const EMAIL_KEY = "email";
const NAME_KEY = "name";
const COMPANY_NAME_KEY = "companyName";


export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),

  getEmail: (): string | null => localStorage.getItem(EMAIL_KEY),
  setEmail: (email: string) => localStorage.setItem(EMAIL_KEY, email),

  getName: (): string | null => localStorage.getItem(NAME_KEY),
  setName: (name: string) => localStorage.setItem(NAME_KEY, name),

  getCompanyName: (): string | null => localStorage.getItem( COMPANY_NAME_KEY),
  setCompanyName: (companyName: string) => localStorage.setItem( COMPANY_NAME_KEY, companyName),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(COMPANY_NAME_KEY);

  },
};
