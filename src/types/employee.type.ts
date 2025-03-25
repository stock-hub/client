import { User } from './user.type'

export enum ROLES {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface Employee {
  _id?: string
  name: string
  phone: number
  email: string
  role: ROLES
  user: User
  createdAt?: Date
  updatedAt?: Date
}
