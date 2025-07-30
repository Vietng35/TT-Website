import { ADMIN_BLOCK, courseService, User, Course } from '@/services/api';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ASSIGN_LECTURER_TO_COURSE } from "@/services/api";

export default function AssignLecturerToCourse() {
    // State for courses, lecturers, status, selected lecturer, and block message
    const [courses, setCourses] = useState<Course[]>([]);
    const [lecturers, setLecturers] = useState<User[]>([]);
    const [status, setStatus] = useState<"success" | "fail" | null>(null);
    const [blockUser] = useMutation(ADMIN_BLOCK);
    const [messageBlockUnblock, setMessageBlockUnblock] = useState("");
    const [selectedLecturer, setSelectedLecturer] = useState<number | null>(null);

    // Fetch courses and lecturers from API
    const fetchData = async () => {
        try {
            const [coursesData, lecturersData] = await Promise.all([
                courseService.getAllCourses(),
                courseService.getAllLecturers()
            ]);
            setCourses(coursesData);
            setLecturers(lecturersData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    // Reset block/unblock message when selected lecturer changes
    useEffect(() => {
        setMessageBlockUnblock("");
    }, [selectedLecturer]);

    // Handle block/unblock action for a user
    const handleBlock = async (userId: number) => {
        if (!userId) return;
        if (window.confirm(`Are you sure you want to block/unblock this user?`)) {
            try {
                const res = await blockUser({
                    variables: {
                        userId
                    }
                });
                setMessageBlockUnblock(res ? "Successfully Blocked" : "Successfully Unblocked");
                fetchData();
            } catch {
                setMessageBlockUnblock("Failed to block/unblock user. Please try again.");
            }
        }
    };

    const [assignLecturerToCourse] = useMutation(ASSIGN_LECTURER_TO_COURSE);

    // Handle form submit to assign lecturer to course
    function handleForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const elements = e.currentTarget.elements as typeof e.currentTarget.elements & {
            lectureId: { value: string };
            courseId: { value: string };
        };
        const lecturerId = Number(elements.lectureId.value)
        const courseId = Number(elements.courseId.value)
        assignLecturerToCourse({
            variables: { lecturerId, courseId }
        })
            .then(() => setStatus("success"))
            .catch(() => setStatus("fail"));
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-8 w-full">
                {/* Assign Lecturer to Course */}
                <div className="flex-1 border border-black-300 rounded-2xl p-2 bg-white">
                    <h2 className="mb-1 font-semibold text-base">Assign Lecturer to Course</h2>
                    <form onSubmit={handleForm} className='flex flex-col gap-1'>
                        <div>
                            <label htmlFor="lectureId" className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">Select Lecturer</label>
                            <select name="lectureId" id="lectureId" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {!lecturers || lecturers.length === 0 ? (
                                    <option disabled>No lecturers available</option>
                                ) : (
                                    lecturers
                                        .filter(user => user.role === "Lecturer")
                                        .map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))
                                )}
                            </select>
                        </div>
                        <div>
                            {/* Select Course Dropdown */}
                            <label htmlFor="courseId" className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">Select Course</label>
                            <select name="courseId" id="courseId" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {!courses || courses.length === 0 ? (
                                    <option disabled>No courses available</option>
                                ) : (
                                    courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        {/* Submit button */}
                        <button className="mt-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                    </form>
                    {/* Show status message */}
                    {status === "success" && (
                        <div className="mt-1 text-green-700 font-semibold text-xs">Successful</div>
                    )}
                    {status === "fail" && (
                        <div className="mt-1 text-red-700 font-semibold text-xs">Fail</div>
                    )}
                </div>
                {/* Block Candidate or Lecturer */}
                <div className="flex-1 border border-black-300 rounded-2xl p-2 bg-white">
                    <h2 className="mb-1 font-semibold text-base">Block Candidate</h2>
                    <label htmlFor="block-lectureId" className="block mb-1 text-xs font-medium text-gray-900 dark:text-white">Select Candidate</label>
                    <select
                        id="block-lectureId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedLecturer ?? ""}
                        onChange={e => setSelectedLecturer(Number(e.target.value))}
                    >
                        <option value="">-- Select Candidate --</option>
                        {lecturers
                            .filter(user => user.role === "Tutor")
                            .map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                    </select>
                    {/* Block/Unblock button depending on isBlock */}
                    {selectedLecturer && (
                        <div className="flex gap-4 mt-2 items-center">
                            {lecturers.find(user => user.id === selectedLecturer)?.isBlock ?
                                <button
                                    onClick={() => handleBlock(selectedLecturer)}
                                    className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs">
                                    Unblock
                                </button> :
                                <button
                                    onClick={() => handleBlock(selectedLecturer)}
                                    className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs">
                                    Block
                                </button>
                            }
                        </div>
                    )}
                    {/* Show block/unblock message */}
                    {messageBlockUnblock && (
                        <div className={`mt-1 text-xs ${messageBlockUnblock.includes("Successfully") ? "text-green-600" : "text-red-600"}`}>
                            {messageBlockUnblock}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}