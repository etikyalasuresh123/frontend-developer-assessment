'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getClasses } from '@/lib/api';
import type { Class } from '@/types/api';

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getClasses();

      setClasses(data);
    } catch (error) {
      console.error(error);
      setError(
        'Unable to load classes. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-600">
            Loading classes...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>

            <button
              onClick={fetchClasses}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Classes
          </h1>

          <p className="mt-2 text-slate-600">
            Select a class to view enrolled students.
          </p>
        </div>

        {/* Classes */}
        {classes.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              No classes available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no classes to display.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/classes/${classItem.id}`}
                className="group rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {classItem.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {classItem.id}
                    </p>
                  </div>

                  <span className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600">
                    →
                  </span>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-sm text-slate-600">
                    Enrolled Students
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {classItem.studentIds.length}
                  </p>
                </div>

                <p className="mt-4 text-sm font-medium text-blue-600">
                  View class →
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}