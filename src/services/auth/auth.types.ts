export type AuthUser = {
  id: string;
  username?: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
};

export type PlatformMe = {
  user: AuthUser;
  hosts: {
    admin: string;
    partner: string;
    wildcardStorefront: string;
    cnameTarget: string;
  };
};
