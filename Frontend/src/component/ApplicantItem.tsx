import { GetApplicantsResponse } from "@/Utils/Submit";
import { useAuth } from "@/hooks/useAuth";
import React from "react";


export interface ApplicantItemProps {
  applicant: GetApplicantsResponse[number];
  isSelected: boolean;
  onCreateComment: (comment: string) => void;
  onDeleteComment: () => void;
  onCreateRanking: (ranking: number) => void;
  onClickSelect: (applicantId: number, selected: boolean) => void;
}

export default function ApplicantItem({
  applicant,
  isSelected,
  onCreateComment,
  onDeleteComment,
  onCreateRanking,
  onClickSelect,
}: ApplicantItemProps) {
  const { user } = useAuth();
  const userApplicant = applicant.userapplicants.find(
    (item) => item.lecturer.id === user?.id
  );

  //This function to handle the comment part
  const handleFormComment: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    onCreateComment((form[0] as HTMLInputElement).value);
  };

  return (
    <div className={`py-4 px-10 border rounded ${applicant.tutor.isBlock ? 'bg-gray-50 border-gray-400 text-gray-900' : 'bg-amber-50 border-amber-400 text-amber-900'}`}>
      {applicant.tutor.isBlock &&
        <div
          className="border rounded py-1 px-2.5 bg-gray-100 border-gray-400 text-gray-500 mb-5">
          Unavailable
        </div>
      }
      <p>
        <strong>Name:</strong> {applicant.tutor.name}
      </p>
      <p>
        <strong>Email:</strong> {applicant.tutor.email}
      </p>
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
        <strong>Skills: </strong>
        {applicant.skill ? applicant.skill : <>No Skills</>}
      </p>

      <p>
        <strong>Academic Credentials:</strong>
      </p>
      {applicant.credential ? (
        applicant.credential
      ) : (
        <>No Academic Credentials</>
      )}

      <p>
        <strong>Experience:</strong>
      </p>
      {applicant.experience ? applicant.experience : <>No Experience</>}

      {isSelected && (
        <div className="flex items-center space-x-2">
          <label className="font-bold">Rating</label>
          <select
            value={userApplicant?.ranking ?? ""}
            onChange={(e) => onCreateRanking(parseInt(e.target.value))}
            className="border border-neutral-500 rounded p-1 w-44 text-sm h-10 bg-white"
          >
            <option value="" className="border-2 py-5 px-4 border-black bg-white">
              Please choose ranking
            </option>
            {Array.from({ length: 5 }, (_, a) => a + 1).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}
      {(!userApplicant || !userApplicant.comment) && (
        <form onSubmit={handleFormComment} className="mt-5 flex flex-row gap-2">
          <div>
            <input
              type="text"
              placeholder="Put your note here...."
              className="border border-neutral-400 px-2.5 py-1 rounded bg-white"
            />
          </div>
          <button className="bg-neutral-800 text-neutral-50 px-2.5 py-1 rounded text-sm font-semibold">
            Submit
          </button>
        </form>
      )}

      {userApplicant?.comment && (
        <div
          key={userApplicant.id}
          className="mt-4 p-4 flex flex-col gap-4 text-black border-2 w-[300] border-black break-words relative"
        >
          <div className="border-b-2">
            <p className="text-sm text-neutral-500">{user?.email} </p>
            {userApplicant.comment}
          </div>
          <p className="justify-baseline text-neutral-500 text-xs">
            Created at: {new Date(userApplicant.createdAt).toString()}
          </p>

          <button
            className="border border-red-400 rounded size-5 text-sm bg-red-50 text-red-500 hover:bg-red-100 absolute top-4 right-4"
            onClick={() => onDeleteComment()}
          >
            X
          </button>
        </div>
      )}

      <br />
      <button
        className={
          "border rounded cursor-pointer py-1 px-2.5 " +
          (isSelected
            ? "bg-red-50 border-red-400 text-red-500 hover:bg-red-100"
            : "bg-green-100 border-green-400 text-green-800 hover:bg-green-200")
        }
        onClick={() => onClickSelect(applicant.id, !isSelected)}
      >
        {isSelected ? "Deselect" : "Select"}
      </button>
    </div>
  );
}
