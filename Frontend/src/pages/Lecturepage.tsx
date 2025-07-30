//Import external components, hooks for the page
import ApplicantItem, { ApplicantItemProps } from "@/component/ApplicantItem";
import {
  GetApplicationFilter,
  searchOptions,
  useApplicants
} from "@/hooks/useApplicants";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import { GetApplicantsResponse } from "@/Utils/Submit";
import { useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BLOCK_STATUS_UPDATED } from "../Service/graph-api";

export default function Lecturepage() {
  //Get the current verificated user from the AuthContext by provided by useAuth
  const { user } = useAuth();
  const router = useRouter();
  //Get the courses that the user is teaching by provided by useCourses
  const courses = useCourses(user?.id);
  const [filter, setFilter] = useState<GetApplicationFilter>({});

  const {
    selectedApplicants = [],
    notSelectedApplicants = [],
    selectApplicant,
    deselectApplicant,
    setApplicantRanking,
    updateComment,
    updateBlock
  } = useApplicants(filter);//useApplicant hook to get data.

  //Search terms
  const [searchTerm, setSearchTerm] = useState("");

  //Search option
  const [searchOption, setSearchOption] =
    useState<GetApplicationFilter["searchOption"]>("name");

  //Sort By
  const [sortBy, setSortBy] =
    useState<GetApplicationFilter["sortBy"]>("courseName");
  // Function to check if applicants is selected by the lecturer
  const isSelected = (applicant: GetApplicantsResponse[number]) =>
    applicant.userapplicants.some(
      (userApplicant) =>
        userApplicant.lecturer.id === user?.id && userApplicant.selected
    );

  // Effect to check that the current user has the "Lecturer" role or not.
  // If not, it redirects to an unauthorized page.
  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }

    if (user && user.role !== "Lecturer") {
      router.replace("/unauthorized");
    }
  }, [user, router]);

  // Function to handle the form submission for searching and filtering functionality
  const handleSubmitSearchForm: React.FormEventHandler<
    HTMLFormElement
  > = async (e) => {
    e.preventDefault();
    setFilter({ searchTerm, searchOption, sortBy });
  };

  // Function to reset the search and filter options to their default values
  const resetSearchandFilterOptions = () => {
    setSortBy("courseName");
    setSearchOption("name");
    setSearchTerm("");
    setFilter({});
  };

  // Function to handle the selection of an applicant
  const onClickSelect: ApplicantItemProps["onClickSelect"] = async (
    applicantId,
    selected
  ) => {
    if (selected) selectApplicant(applicantId);
    else deselectApplicant(applicantId);
  };

  //To get real-time features
  useSubscription(BLOCK_STATUS_UPDATED, {
    onSubscriptionData: (subscriptionData) => {
      if (subscriptionData?.subscriptionData?.data?.blockStatusUpdated) {
        alert(`${subscriptionData?.subscriptionData?.data?.blockStatusUpdated.email} is ${subscriptionData?.subscriptionData?.data?.blockStatusUpdated.isBlock ? 'unavailable' : 'available'} at this semester!`);
        updateBlock();
      }
    },
  });

  return (
    <>
      <div className="py-5 px-20 w-[900]px mb-10">
        <h2 className="font-bold m-auto mb-3 items-center justify-center flex text-2xl">
          Recent Update
        </h2>
        <form
          className="p-4 gap-3.5 flex flex-col justify-center py-4 px-10 border rounded bg-amber-100 border-amber-400 text-amber-900 w-240 mx-auto"
          onSubmit={handleSubmitSearchForm}
        >
          <div className="flex gap-3">
            <div className="basis-1/2">
              <div className="font-semibold mb-2">Search</div>

              {searchOption === "course" ? (
                <select
                  className="border border-neutral-400 px-2.5 py-1 rounded w-100 h-10"
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <option value="">-- Select The Courses</option>
                  {courses.map((courseObject) => (
                    <option key={courseObject.id} value={courseObject.id}>
                      {courseObject.name}{" "}
                    </option>
                  ))}
                </select>
              ) : searchOption === "role" ? (
                <select
                  className="border border-neutral-400 px-2.5 py-1 rounded w-100 h-10"
                  onChange={(e) => setSearchTerm(e.target.value)}
                >
                  <option value="">-- Select Role</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                  <option value="Tutor">Tutor</option>
                </select>
              ) : searchOption === "availability" ?
                <>
                  <select
                    className="border border-neutral-400 px-2.5 py-1 rounded w-100 h-10"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  >
                    <option value="">-- Select Availability</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                  </select>
                </> :
                (
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-neutral-400 px-2.5 py-1 rounded w-100 h-10"
                  />
                )}

              <div className="flex gap-x-0.5 mt-2">
                {searchOptions.map((option) => (
                  <label
                    key={option}
                    htmlFor={option}
                    className="inline-flex items-center gap-1 mr-4"
                  >
                    <input
                      type="radio"
                      name="searchOption"
                      checked={searchOption === option}
                      onChange={() => setSearchOption(option)}
                    />
                    <span>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col basis-1/2">
              <div className="font-semibold mb-2">
                Sort Area
              </div>
              <select
                className="border border-neutral-400 px-2.5 py-1 rounded w-100 h-10"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as GetApplicationFilter["sortBy"])
                }
              >
                <option value="courseName">Course Name</option>
                <option value="availability">Time</option>
              </select>
            </div>

          </div>

          <div className="flex gap-3">

            <button className="border px-2.5 py-1 hover:border-amber-300 rounded bg-amber-800 text-neutral-50">
              Search
            </button>

            <button
              className="border px-2.5 py-1 hover:border-red-300 rounded bg-amber-800 text-neutral-50"
              onClick={() => resetSearchandFilterOptions()}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="flex flex-row mt-10 gap-2">
          <div className="basis-1/2 rounded-lg shadow-md border border-gray-300 py-5 px-10">
            <div className="text-2xl text-center font-bold mb-5">
              Not Selected Candidates
            </div>
            <div className="flex flex-col gap-6">
              {notSelectedApplicants.map((applicant) => {
                return (
                  <ApplicantItem
                    key={applicant.id}
                    applicant={applicant}
                    isSelected={isSelected(applicant)}
                    onClickSelect={onClickSelect}
                    onCreateComment={(comment) =>
                      updateComment(applicant.id, comment)
                    }
                    onDeleteComment={() => updateComment(applicant.id, "")}
                    onCreateRanking={(ranking) =>
                      setApplicantRanking(applicant.id, ranking)
                    }
                  />
                );
              })}
            </div>
          </div>

          <div className="basis-1/2 rounded-lg shadow-md border border-gray-300 py-5 px-10">
            <div className="text-2xl text-center font-bold mb-5">
              Selected Candidates
            </div>
            <div className="flex flex-col gap-6">
              {selectedApplicants.length > 0 ? <>
                {selectedApplicants.map((applicant) => (
                  <ApplicantItem
                    key={applicant.id}
                    applicant={applicant}
                    isSelected={isSelected(applicant)}
                    onClickSelect={onClickSelect}
                    onCreateComment={(comment) =>
                      updateComment(applicant.id, comment)
                    }
                    onDeleteComment={() => updateComment(applicant.id, "")}
                    onCreateRanking={(ranking) =>
                      setApplicantRanking(applicant.id, ranking)
                    }
                  />

                ))}
              </> : <></>}
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
