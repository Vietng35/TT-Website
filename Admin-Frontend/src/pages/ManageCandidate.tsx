import {
    ADMIN_CANDIDATE_FOR_COURSE,
    ADMIN_CANDIDATE_NO_CHOSEN,
    ADMIN_CANDIDATE_FOR_COURSE_THREE_COURSES,
    COURSE_QUERY,
} from '@/services/api';
import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

// ManageCandidate page: display and manage candidate lists
export default function ManageCandidate() {
    // Get current user and router for authentication and navigation
    const { user } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.replace("/loginForAdmin")
        }
    }, [router, user]);

    // State for selected course in dropdown
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    // Query: get all courses for dropdown
    const { data: allCoursesData } = useQuery(COURSE_QUERY);

    // Query: get candidates for selected course
    const { data: courseResponse } = useQuery(ADMIN_CANDIDATE_FOR_COURSE, {
        variables: {
            courseId: selectedCourse
        },
        skip: !selectedCourse // Skip query if no course selected
    });

    // Query: get candidates not chosen for any course
    const { data: noChosenData } = useQuery(ADMIN_CANDIDATE_NO_CHOSEN);

    // Query: get candidates chosen for more than 3 courses
    const { data: threeCoursesData } = useQuery(ADMIN_CANDIDATE_FOR_COURSE_THREE_COURSES);

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Manage Candidates</h1>
            <div className='mb-4'>
                {/* Course selection dropdown */}
                <label htmlFor='course-select' className='block mb-2'>Select Course:</label>
                <select
                    id='course-select'
                    value={selectedCourse ?? ''}
                    onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
                    className='border p-2 rounded'
                >
                    <option value=''>All Courses</option>
                    {/* Render all courses as options */}
                    {allCoursesData?.courses.map((course: any) => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>
            {/* Table: Candidates for selected course */}
            {selectedCourse && Array.isArray(courseResponse?.listCandidateForCourse) && courseResponse.listCandidateForCourse.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-1">Candidates for Selected Course</h3>
                    <table className="w-full text-sm border mb-2">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-2 py-1 border">ID</th>
                                <th className="px-2 py-1 border">Name</th>
                                <th className="px-2 py-1 border">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render candidate rows */}
                            {courseResponse.listCandidateForCourse.map((user: any) =>
                                <tr key={user.id}>
                                    <td className="border px-2 py-1">{user.id}</td>
                                    <td className="border px-2 py-1">{user.name}</td>
                                    <td className="border px-2 py-1">{user.email}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Table: Candidates not chosen */}
            <div className="mb-6">
                <h3 className="font-semibold mb-1">Candidates Not Chosen</h3>
                <table className="w-full text-sm border mb-2">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-2 py-1 border">ID</th>
                            <th className="px-2 py-1 border">Name</th>
                            <th className="px-2 py-1 border">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render candidate rows */}
                        {noChosenData?.listCandidateNoChosen?.map((user: any) => (
                            <tr key={user.id}>
                                <td className="border px-2 py-1">{user.id}</td>
                                <td className="border px-2 py-1">{user.name}</td>
                                <td className="border px-2 py-1">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table: Candidates chosen for more than 3 courses */}
            <div>
                <h3 className="font-semibold mb-1">Candidates Chosen For More Than 3 Courses</h3>
                <table className="w-full text-sm border mb-2">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-2 py-1 border">ID</th>
                            <th className="px-2 py-1 border">Name</th>
                            <th className="px-2 py-1 border">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render candidate rows */}
                        {threeCoursesData?.listCandidateChosenForMoreThreeCourses?.map((user: any) => (
                            <tr key={user.id}>
                                <td className="border px-2 py-1">{user.id}</td>
                                <td className="border px-2 py-1">{user.name}</td>
                                <td className="border px-2 py-1">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}