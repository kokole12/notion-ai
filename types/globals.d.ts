export {};

declare global {
  interface CustomJwtSessionClaims {
    fullName?: string;
    email?: string;
    lastName?: string;
    firstName?: string;
    image?: string;
  }
}
