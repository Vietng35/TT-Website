// import { useLecturerCourses } from "@/hooks/useApplicants";
import ApplicantItem from "@/component/ApplicantItem";
import { useApplicants } from "@/hooks/useApplicants";
import { useAuth } from "@/hooks/useAuth";
import { ApplicantService } from "@/Service/applicantService";
import { GetApplicantsResponse } from "@/Utils/Submit";
import { useEffect, useState } from "react";
import { changePassword } from "@/hooks/useChangePassWord";

export default function Profile() {
  const { user } = useAuth();
  const email = user?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // const { data: courses = [], isLoading,isError } = useLecturerCourses(user);
  const {
    courses,
    coursesLoading,
    courseError
  } = useApplicants({})

  const [applications, setApplications] = useState<GetApplicantsResponse>()

  useEffect(() => {
    if(user){
      fetchApplicant(user.id)
    }
  }, [user])

  const fetchApplicant = async (applicantID: number) =>{
    const response = await ApplicantService.getApplicationById(applicantID);

    setApplications(response)
  }
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New Passwords do not match");
      return;
    }
    if (!email) {
      setMessage("User email is not available");
      return;
    }
    const passPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!newPassword.match(passPattern)) {
      setMessage("Password must be at least 8 characters, include a letter, a number, and a special character.");
      return;
    }
    try {
      const rs = await changePassword(email, newPassword);
      if (rs.status) {
        setMessage("Successfully changed password");
      } else {
        setMessage(rs.message || "Error changing password");
      }
    } catch (error) {
      setMessage("Error changing password");
    }
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left column: User Profile & Assign Course */}
      <div className="flex-1 flex flex-col gap-6">
        {/* User Profile box */}
        <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
          <h1 className="text-xl font-semibold mb-4">User Profile</h1>
          <p>Email: {user?.email}</p>
          <p>Name: {user?.name}</p>
          <p>ID: {user?.id}</p>
          <p>Role: {user?.role}</p>
          <p>
            Created at:{" "}
            {user?.createdAt && new Date(user.createdAt).toString()}
          </p>
        </div>

        {/* Assign Course box (only for Lecturer) */}
        {user?.role === "Lecturer" && (
          <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6">
            <h2 className="font-medium mb-2">Assign Course</h2>
            {coursesLoading && <p>Loading...</p>}
            {courseError && <p className="text-red-600">Error</p>}
            {!coursesLoading && !courses.length && (
              <p>(You are not assigned to any courses)</p>
            )}
            {courses && courses.length > 0 && (
              <ul className="list-disc pl-6">
                {courses.map((c: { id: number; name: string }) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div>
          {user?.role == "Tutor" ? <><p className="text-2xl text-center"><strong>Recent Applications</strong></p></>: <></>}
          
          {applications && applications.length > 0 ? 
          <>
          {applications.map((applicant) => {
            return (
            <>
            <div className="border-2 p-2 m-5">
              <p>
                <strong>Course:</strong> {applicant.course.name}
              </p>
              <p>
                <strong>Role:</strong> {applicant.role}
              </p>
              <p>
                <strong>Availability:</strong> {applicant.availability}
              </p>
              <p>
                <strong>Status:</strong> {applicant.userapplicants.some(applicant => applicant.selected) ? <>Selected</>: <>Not Selected</>}
              </p>
           </div>
            </>)
          })}
          </>:<><p className=" text-2xl">No Recent Applications</p></>}
        </div>
      </div>

      {/* Right column: Change Password */}
      <div className="flex-1">
        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-lg shadow-md border border-gray-300 p-6 flex flex-col gap-4"
        >
          <h2 className="text-xl font-semibold text-center mb-2">Change Password</h2>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
          {message && message === "Successfully changed password" ? (
            <div className="text-center text-sm mt-2 text-green-600">{message}</div>
          ) : (
            <div className="text-center text-sm mt-2 text-red-600">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
}
