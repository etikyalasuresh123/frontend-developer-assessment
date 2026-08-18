export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

export interface Class {
  id: string;
  name: string;
  studentIds: string[];
}


export interface ClassesResponse {
  data: Class[];
}

export interface StudentsResponse {
  data: Student[];
  total: number;
}