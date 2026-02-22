import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      class?: string;
    };
  }

  interface User {
    role: string;
    class?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    class?: string;
  }
}

