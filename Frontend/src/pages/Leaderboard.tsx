import LeaderboardTable from "@/component/LeaderboardTable";
import { useEffect, useState } from "react";
import { Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import router from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { ApplicantService } from "@/Service/applicantService";

export interface GetLeaderboardResponse {
  selectedApplicants: selectedApplicants[]
  notSelectedApplicants: notSelectedApplicants[]
}

export interface selectedApplicants{
  candidateName: string, count: number, courseName: string
}

export interface notSelectedApplicants{
  candidateName: string, courseName: string
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Leaderboard() {
  const { user } = useAuth();
  // Most selected candidates
  const [mostSelectedCandidates, setMostSelectedCandidates] = useState<selectedApplicants[]>([]);
  // Least selected candidates
  const [leastSelectedCandidates, setLeastSelectedCandidates] = useState<selectedApplicants[]>([]);
  // Not selected candidates
  const [notSelectedCandidates, setNotSelectedCandidates] = useState<notSelectedApplicants[]>([]);
  //Filter options
  const [isSettingFilter, setIsSettingFilter] = useState(false)
  //Display type depend on user choices
  const [displayType, setDisplayType] = useState("Most Selected")
  //filter by count number
  const [countNumber, setCountNumber] = useState(0);
  //filter by limit
  const [limit, setLimit] = useState(0)
  useEffect(() => {
    if (user && user.role !== "Lecturer") {
      router.replace("/unauthorized");
    }
  }, [router, user]);

//Fetch user when rendering
  useEffect(() => {
    const userCountNumber = localStorage.getItem("countNumber");
    const userLimit = localStorage.getItem("limit");

    if(userCountNumber && userLimit){
      setCountNumber(Number(userCountNumber));
      setLimit(Number(userLimit))
      fetchApplicants(Number(userLimit), Number(userCountNumber))
    }
    
  }, [])

//Fetch applicants
/**
 * 
 * @param limit Number of candidates that lecturer wants to display
 * @param countNumber Number of select count that lecturer wants to display
 */
  const fetchApplicants = async ( limit: number, countNumber: number) =>{
    const response = await ApplicantService.getApplicantWithSelectCount(limit,countNumber);
    
    setMostSelectedCandidates(response.selectedApplicants)
    setLeastSelectedCandidates(response.selectedApplicants.toReversed())
    setNotSelectedCandidates(response.notSelectedApplicants)

  }

//Option for bar charts
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

//Data for the most selected applicants
  const mostSelectedBarData = {
    labels: mostSelectedCandidates.map(applicant => applicant.candidateName),
    datasets: [
      {
        label: "Most Selected Candidates",
        data: mostSelectedCandidates.map(applicant => applicant.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
      },
    ],
  };

  //Data for the least selected applicants
  const leastSelectedBarData = {
    labels: leastSelectedCandidates.map(applicant => applicant.candidateName),
    datasets: [
      {
        label: "Least Selected Candidates",
        data: leastSelectedCandidates.map(applicant => applicant.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
      },
    ],
  };

  //Handle Filter form
  const handleSubmitSearchForm: React.FormEventHandler<HTMLFormElement> = (e) =>{
    e.preventDefault();

    //Save user choice into localStorage
    localStorage.setItem("countNumber", JSON.stringify(countNumber))
    localStorage.setItem("limit", JSON.stringify(limit))

    //Fetching applicants based on user inputs
    fetchApplicants(limit, countNumber)
  }

  return (
    <>
      <div className="p-4 gap-3.5 flex flex-row items-center mx-auto justify-center">
          {displayType !== "Most Selected" ? 
          <button className="border-2 mt-3.5 p-4 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-400" onClick={() => setDisplayType("Most Selected")}>Most Selected Candidates</button>
          :
          <button className="border-2 mt-3.5 p-4 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-600 bg-amber-400" onClick={() => setDisplayType("Most Selected")}>Most Selected Candidates</button> 
          }
          {displayType !== "Least Selected" ? 
          <button className="border-2 mt-3.5 p-4 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-400" onClick={() => setDisplayType("Least Selected")}>Least Selected Candidates</button>
          :
          <button className="border-2 mt-3.5 p-4 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-600 bg-amber-400" onClick={() => setDisplayType("Least Selected")}>Least Selected Candidates</button> 
          }
          {displayType !== "Not Selected" ? 
          <button className="border-2 mt-3.5 p-4 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-400" onClick={() => setDisplayType("Not Selected")}>Not Selected Candidates</button>
          :
          <button className="border-2 mt-3.5 p-4 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-600 bg-amber-400" onClick={() => setDisplayType("Not Selected")}>Not Selected Candidates</button> 
          }

          {displayType !== "Not Selected" ? 
          <>
          {isSettingFilter ? 
          <>
          <button className="border-2 mt-3.5 p-5 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-400" onClick={() => setIsSettingFilter(!isSettingFilter)}>
            <img src="funnel-fill.svg"></img>
          </button>
          <div>
            <form className="border-2 mt-3.5 p-3 flex flex-col" onSubmit={handleSubmitSearchForm}>
                <strong>Minimum Select Number:</strong>
                <select
                    className="border border-neutral-400 px-2.5 py-1 rounded w-30"
                    onChange={(e) => setCountNumber(Number(e.target.value))}
                    value={countNumber}
                  >
                    <option value="0">-No Limit-</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>

                <strong>Maximum Candidates:</strong>
                <select
                  className="border border-neutral-400 px-2.5 py-1 rounded w-30"
                  onChange={(e) => setLimit(Number(e.target.value))}
                  value={limit}
                >
                  <option value="0">-No Limit-</option>
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

              <button className="border-2 mt-3.5 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-400">Filter</button>
            </form>
          </div>
          </>: 
          <>
          <button className="border-2 mt-3.5 p-5 hover:cursor-pointer hover:bg-amber-200 active:bg-amber-400" onClick={() => setIsSettingFilter(!isSettingFilter)}>
            <img src="funnel.svg"></img>
          </button>
          </>}
          </>:<></>}
      </div>
      <div className="flex flex-col size max-w-400 m-auto">
        {displayType === "Most Selected" ? <>
          <p className="font-bold text-center text-4xl">Most Selected Tutors</p>
          {
            mostSelectedCandidates.length > 0 && mostSelectedBarData ? (
              <div className="bg-white p-6 rounded-lg shadow-lg w-300 m-auto">
                <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>
                <Bar className="w-200" options={chartOptions} data={mostSelectedBarData} />
              </div>
            ):<><p className="text-center text-2xl text-red-600">No Application Data</p></>
          }
        </>: displayType === "Least Selected" ? 
        <>
          <p className="font-bold text-center text-4xl">Least Selected Tutors</p>
          {
            leastSelectedBarData && leastSelectedCandidates.length > 0? (
              <div className="bg-white p-6 rounded-lg shadow-lg w-300 m-auto">
                <h2 className="text-xl font-semibold mb-4">Bar Chart</h2>
                <Bar className="w-200" options={chartOptions} data={leastSelectedBarData} />
              </div>
            ):<><p className="text-center text-2xl text-red-600">No Application Data</p></>
          }
        </>:
        <>{notSelectedCandidates.length > 0 ? 
        <>
          <LeaderboardTable notSelectedCandidates={notSelectedCandidates}></LeaderboardTable>
        </>:

        <>
          <p className="text-center text-2xl text-red-600">No Application Data</p>
        </>}</>}

        <br></br>
      </div>
    </>
  );
}