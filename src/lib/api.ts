import axios from 'axios';
import type {
  Class,
  ClassesResponse,
  Student,
  StudentsResponse,
} from '@/types/api';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getClasses = async (): Promise<Class[]> => {
  const response = await api.get<ClassesResponse>('/classes');

  return response.data.data;
};

export const getClass = async (classId: string): Promise<Class> => {
  const response = await api.get<Class>(`/classes/${classId}`);

  return response.data;
};

export const getClassStudents = async (
  classId: string,
  search?: string
): Promise<StudentsResponse> => {
  const response = await api.get<StudentsResponse>(
    `/classes/${classId}/students`,
    {
      params: search ? { search } : undefined,
    }
  );

  return response.data;
};

export const getStudents = async (
  search?: string
): Promise<StudentsResponse> => {
  const response = await api.get<StudentsResponse>('/students', {
    params: search ? { search } : undefined,
  });

  return response.data;
};

export const getStudent = async (
  studentId: string
): Promise<Student> => {
  const response = await api.get<Student>(
    `/students/${studentId}`
  );

  return response.data;
};

export const enrollStudent = async (
  classId: string,
  studentId: string
): Promise<void> => {
  await api.post(`/classes/${classId}/students`, {
    studentId,
  });
};

export const removeStudent = async (
  classId: string,
  studentId: string
): Promise<void> => {
  await api.delete(
    `/classes/${classId}/students/${studentId}`
  );
};