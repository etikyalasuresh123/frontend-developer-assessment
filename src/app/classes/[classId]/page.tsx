'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    getClass,
    getClassStudents,
    getStudents,
    enrollStudent,
    removeStudent,
} from '@/lib/api';
import type { Class, Student } from '@/types/api';

interface ClassDetailsPageProps {
    params: Promise<{
        classId: string;
    }>;
}

export default function ClassDetailsPage({
    params,
}: ClassDetailsPageProps) {

    const { classId } = use(params);

    const [classData, setClassData] =
        useState<Class | null>(null);

    const [students, setStudents] =
        useState<Student[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [search, setSearch] = useState('');

    const [searchLoading, setSearchLoading] =
        useState(false);

    const [showEnroll, setShowEnroll] = useState(false);

    const [availableStudents, setAvailableStudents] =
        useState<Student[]>([]);

    const [selectedStudent, setSelectedStudent] =
        useState('');

    const [enrollLoading, setEnrollLoading] =
        useState(false);

    const [enrollMessage, setEnrollMessage] =
        useState('');

    const [removeLoading, setRemoveLoading] =
        useState<string | null>(null);



    const handleEnroll = async () => {
        if (!selectedStudent) {
            return;
        }

        setEnrollLoading(true);
        setEnrollMessage('');

        try {
            await enrollStudent(classId, selectedStudent);

            toast.success('Student enrolled successfully.');

            setSelectedStudent('');

            const updatedStudents = await getClassStudents(classId);

            setStudents(updatedStudents.data);
        } catch (error: any) {
            console.error('Enrollment failed:', error);

            if (error.response?.status === 409) {
                setEnrollMessage(
                    'Student is already enrolled in this class.'
                );
            } else {
                setEnrollMessage(
                    'Failed to enroll student. Please try again.'
                );
            }
        } finally {
            setEnrollLoading(false);
        }
    };

    const handleRemove = async (studentId: string) => {
        const confirmed = window.confirm(
            'Are you sure you want to remove this student from the class?'
        );

        if (!confirmed) {
            return;
        }

        setRemoveLoading(studentId);
        setError('');

        try {
            await removeStudent(classId, studentId);

            const updatedStudents =
                await getClassStudents(classId);

            setStudents(updatedStudents.data);
            toast.success('Student removed successfully.');
        } catch (error) {


            console.error('Remove failed:', error);

            toast.error(
                'Failed to remove student. Please try again.'
            );
        } finally {
            setRemoveLoading(null);
        }
    };

    const searchStudents = async (value: string) => {
        try {
            setSearchLoading(true);
            setError('');

            // const { classId } = await params;

            const response = await getClassStudents(
                classId,
                value.trim() || undefined
            );

            setStudents(response.data);
        } catch (error) {
            console.error(error);

            setError(
                'Unable to search students. Please try again.'
            );
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        const loadClassData = async () => {
            try {
                setLoading(true);
                setError('');

                // const { classId } = await params;

                const [
                    classResponse,
                    studentsResponse,
                ] = await Promise.all([
                    getClass(classId),
                    getClassStudents(classId),
                ]);

                setClassData(classResponse);
                setStudents(studentsResponse.data);
            } catch (error) {
                console.error(error);

                setError(
                    'Unable to load class details. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadClassData();
    }, [classId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-100 p-6 md:p-10">
                <div className="mx-auto max-w-6xl">
                    <p className="text-slate-600">
                        Loading class details...
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

    if (!classData) {
        return null;
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">

                {/* Back button */}

                <Link
                    href="/classes"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    ← Back to Classes
                </Link>

                {/* Class information */}

                <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                    <button
                        type="button"
                        onClick={async () => {
                            setShowEnroll(!showEnroll);

                            if (!showEnroll) {
                                try {
                                    const response = await getStudents();

                                    const enrolledResponse =
                                        await getClassStudents(classId);

                                    const enrolledIds = new Set(
                                        enrolledResponse.data.map((student) => student.id)
                                    );

                                    const available = response.data.filter(
                                        (student) => !enrolledIds.has(student.id)
                                    );

                                    setAvailableStudents(available);
                                } catch (error) {
                                    console.error(error);
                                    setEnrollMessage(
                                        'Unable to load students.'
                                    );
                                }
                            }
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        {showEnroll
                            ? 'Cancel Enrollment'
                            : 'Enroll Student'}
                    </button>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-sm text-slate-500">
                                Class
                            </p>

                            <h1 className="mt-1 text-3xl font-bold text-slate-900">
                                {classData.name}
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Class ID: {classData.id}
                            </p>
                        </div>

                        <div className="rounded-lg bg-blue-50 px-5 py-4">
                            <p className="text-sm text-blue-600">
                                Enrolled Students
                            </p>

                            <p className="mt-1 text-2xl font-bold text-blue-700">
                                {students.length}
                            </p>
                        </div>

                    </div>
                </div>

                {/* 👇 ADD ENROLLMENT FORM HERE */}
                {showEnroll && (
                    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900">
                            Enroll Student
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Select an existing student to enroll in this class.
                        </p>

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row">
                            <select
                                value={selectedStudent}
                                onChange={(event) =>
                                    setSelectedStudent(event.target.value)
                                }
                                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                            >
                                <option value="">
                                    Select a student
                                </option>

                                {availableStudents.map((student) => (
                                    <option
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.firstName} {student.lastName} -{' '}
                                        {student.id}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={handleEnroll}
                                disabled={
                                    !selectedStudent || enrollLoading
                                }
                                className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {enrollLoading
                                    ? 'Enrolling...'
                                    : 'Enroll'}
                            </button>
                        </div>

                        {enrollMessage && (
                            <p className="mt-3 text-sm text-slate-600">
                                {enrollMessage}
                            </p>
                        )}
                    </div>
                )}

                {/* Students */}

                <div className="mt-8 rounded-xl bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-xl font-bold text-slate-900">
                            Enrolled Students
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Students currently enrolled in this class.
                        </p>

                        <div className="mt-5">
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setSearch(value);
                                    searchStudents(value);
                                }}
                                placeholder="Search by student name or ID..."
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            {searchLoading && (
                                <p className="mt-2 text-sm text-slate-500">
                                    Searching students...
                                </p>
                            )}
                        </div>
                    </div>

                    {students.length === 0 ? (
                        <div className="p-10 text-center">

                            <h3 className="text-lg font-semibold text-slate-900">
                                No students enrolled
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                This class currently has no enrolled students.
                            </p>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            Student
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            Student ID
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            Gender
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            Age
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {students.map((student) => {

                                        const birthDate =
                                            new Date(student.dateOfBirth);

                                        const today = new Date();

                                        let age =
                                            today.getFullYear() -
                                            birthDate.getFullYear();

                                        const monthDifference =
                                            today.getMonth() -
                                            birthDate.getMonth();

                                        if (
                                            monthDifference < 0 ||
                                            (
                                                monthDifference === 0 &&
                                                today.getDate() <
                                                birthDate.getDate()
                                            )
                                        ) {
                                            age--;
                                        }

                                        return (
                                            <tr
                                                key={student.id}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                            >

                                                <td className="px-6 py-4">

                                                    <Link
                                                        href={`/students/${student.id}`}
                                                        className="font-medium text-blue-600 hover:text-blue-700"
                                                    >
                                                        {student.firstName}{' '}
                                                        {student.lastName}
                                                    </Link>

                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {student.id}
                                                </td>

                                                <td className="px-6 py-4 text-sm capitalize text-slate-600">
                                                    {student.gender}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {age}
                                                </td>

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${student.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                    >
                                                        {student.status}
                                                    </span>

                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(student.id)}
                                                        disabled={removeLoading === student.id}
                                                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {removeLoading === student.id
                                                            ? 'Removing...'
                                                            : 'Remove'}
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>
        </main>
    );
}