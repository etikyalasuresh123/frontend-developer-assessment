'use client';

import { useEffect, useState } from 'react';
import { getClasses, getStudents } from '@/lib/api';
import type { Class, Student } from '@/types/api';

export default function Home() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [classesData, studentsResponse] = await Promise.all([
        getClasses(),
        getStudents(),
      ]);

      setClasses(classesData);
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error(error);
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeStudents = students.filter(
    (student) => student.status === 'active'
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>

        <button
          onClick={fetchDashboardData}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Student Management Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Overview of your school
        </p>

        {/* Statistics */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Students</p>
            <h2 className="mt-2 text-3xl font-bold">
              {students.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Classes</p>
            <h2 className="mt-2 text-3xl font-bold">
              {classes.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Active Students</p>
            <h2 className="mt-2 text-3xl font-bold">
              {activeStudents}
            </h2>
          </div>
        </section>

        {/* Classes */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              Available Classes
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">
                  {classItem.name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Class ID: {classItem.id}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Enrolled Students: {classItem.studentIds.length}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}