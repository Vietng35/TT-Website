import { CourseTableCourseManageQuery } from '@/__generated__/graphql';
import { ADMIN_CREATE, ADMIN_DELETE, ADMIN_EDIT, COURSE_QUERY } from '@/services/api';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react'

export default function CourseTableCourseManagement() {
    // Query to get all courses and refetch function
    const { data: courseResponse, refetch } = useQuery<CourseTableCourseManageQuery>(COURSE_QUERY);
    // Mutations for edit, delete, create course
    const [editCourse] = useMutation(ADMIN_EDIT);
    const [deleteCourse] = useMutation(ADMIN_DELETE);
    const [createCourse] = useMutation(ADMIN_CREATE);

    // State for editing mode, editing course id, input value, and message
    const [isEditing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState<number>();
    const [input, setInput] = useState("");
    const [message, setMessage] = useState("");

    // Handle delete course
    const handleDelete = async (courseResponseId: number) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await deleteCourse({
                    variables: {
                        courseId: courseResponseId
                    }
                });
                setMessage("Course deleted successfully.");
                refetch();
            } catch {
                setMessage("Failed to delete course. Please try again.");
            }
        }
    };

    // Validate course name format (must be COSCxxxx)
    const validateCourseName = (name: string) => {
        if (name.substring(0, 4) !== "COSC") {
            return false;
        }
        for(let i:number=4; i<=7; i++) {
            if(!Number.isInteger(Number.parseInt(name[i]))) {
                return false;
            }
        }
        return true;
    }

    // Handle create or edit course submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!validateCourseName(input)) {
                setMessage("The course code must follow the format COSCxxxx, where xxxx stands for any number between 0 and 9!");
                return;
            }

            if (isEditing && editingId !== null && editingId !== undefined) {
                // Edit course
                await editCourse({
                    variables: {
                        courseId: editingId,
                        courseName: input
                    }
                });
            } else {
                // Create new course
                await createCourse({
                    variables: {
                        courseName: input
                    }
                });
            }
            setMessage("Successfully submit!");
            setInput("");
            setEditing(false);
            setEditingId(undefined);
            refetch();
        } catch {
            setMessage("Fail to submit");
        }
    }
    return (
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto mt-4">
            {/* Course Table */}
            <div className="flex-1 overflow-x-auto bg-white rounded-lg shadow p-2">
                <table className="min-w-[500px] w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-3 py-2">Course Id</th>
                            <th className="px-3 py-2">Course Name</th>
                            <th className="px-3 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseResponse?.courses.map((course) => (
                            <tr key={course.id} className="bg-white border-b border-gray-200">
                                <td className="px-3 py-2">{course.id}</td>
                                <td className="px-3 py-2">{course.name}</td>
                                <td className="px-3 py-2">
                                    {/* Delete button */}
                                    <button onClick={() => handleDelete(course.id)} className="text-white bg-red-700 hover:bg-red-800 rounded px-3 py-1 text-xs mr-2">DELETE</button>
                                    {/* Edit button */}
                                    <button onClick={() => {
                                        setEditing(true);
                                        setEditingId(course.id);
                                        setInput(course.name);
                                    }} className="text-white bg-yellow-400 hover:bg-yellow-500 rounded px-3 py-1 text-xs">EDIT</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Create/Edit Course Form */}
            <form onSubmit={handleSubmit} className="flex-1 bg-white rounded-lg shadow p-2 max-w-xs">
                <h2 className="text-base mb-2 justify-center items-center">{isEditing ? `Edit for Course Id ${editingId}` : "Create"}</h2>
                <div className="mb-2">
                    <label htmlFor="base-input" className="block mb-1 text-xs font-medium text-gray-900">Course Name</label>
                    {/* Input for course name */}
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        type="text"
                        id="base-input"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                        required
                    />
                </div>
                {/* Submit button */}
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 rounded text-xs px-4 py-1"
                >
                    Submit
                </button>
                {/* Cancel button when editing */}
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(false);
                            setEditingId(undefined);
                            setInput('');
                        }}
                        className="ml-2 text-white bg-gray-500 hover:bg-gray-600 rounded text-xs px-4 py-1"
                    >
                        Cancel
                    </button>
                )}
                {/* Show message */}
                {message && (
                    <div className={`mt-2 text-center border p-2 text-xs ${message.includes("Success") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    )
}