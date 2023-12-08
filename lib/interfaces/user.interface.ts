export interface UserType {
  _id: string;
  email: string;
  role: UserRolesType;
  image?: string;
  profileURL?: string;
}

export type UserRolesType = "admin" | "user";
