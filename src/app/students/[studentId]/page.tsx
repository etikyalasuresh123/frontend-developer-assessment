'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStudent } from '@/lib/api';
import type { Student } from '@/types/api';

interface StudentDetailsPageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default function StudentDetailsPage({
  params,
}: StudentDetailsPageProps) {
  const [student, setStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError('');

        const { studentId } = await params;

        const response = await getStudent(studentId);

        setStudent(response);
      } catch (error) {
        console.error(error);

        setError(
          'Unable to load student details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-slate-600">
            Loading student details...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">
              {error}
            </p>

            <Link
              href="/classes"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Classes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Back button */}

        <Link
          href="/classes"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Classes
        </Link>

        {/* Header */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Student
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {student.firstName}{' '}
                {student.lastName}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Student ID: {student.id}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${
                student.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {student.status}
            </span>

          </div>

        </div>

        {/* Student Information */}

        <div className="mt-8 rounded-xl bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Student Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Personal and enrollment information.
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">

            {/* Full Name */}

            <div>
              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {student.firstName}{' '}
                {student.lastName}
              </p>
            </div>

            {/* Student ID */}

            <div>
              <p className="text-sm text-slate-500">
                Student ID
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {student.id}
              </p>
            </div>

            {/* Date of Birth */}

            <div>
              <p className="text-sm text-slate-500">
                Date of Birth
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {student.dateOfBirth}
              </p>
            </div>

            {/* Gender */}

            <div>
              <p className="text-sm text-slate-500">
                Gender
              </p>

              <p className="mt-1 font-medium capitalize text-slate-900">
                {student.gender}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="mt-1 break-all font-medium text-slate-900">
                {student.email}
              </p>
            </div>

            {/* Phone */}

            <div>
              <p className="text-sm text-slate-500">
                Phone
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {student.phone}
              </p>
            </div>

            {/* Enrollment Date */}

            <div>
              <p className="text-sm text-slate-500">
                Enrollment Date
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {student.enrollmentDate}
              </p>
            </div>

            {/* Enrollment Status */}

            <div>
              <p className="text-sm text-slate-500">
                Enrollment Status
              </p>

              <p className="mt-1 font-medium capitalize text-slate-900">
                {student.status}
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}