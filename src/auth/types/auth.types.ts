interface Role {
  id: number;
  name: string;
  description: string;
  users?: any;
  permissions?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTypes {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}
