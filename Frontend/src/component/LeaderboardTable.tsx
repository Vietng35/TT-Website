import { notSelectedApplicants } from "@/pages/Leaderboard";

export default function LeaderboardTable({notSelectedCandidates} : {notSelectedCandidates: notSelectedApplicants[]}){

    return (
    <>
    <table className="m-auto mt-20 w-3/4">
        <caption className="text-center text-2xl font-bold mb-2">{}</caption>
        <thead>
            <tr className='border-2 border-black text-l bg-amber-100'>
                <th className='border-2 border-black text-left p-2'>NAME</th>
                <th className='border-2 border-black text-left p-2'>APPLIED COURSES</th>
            </tr>
        </thead>
        <tbody>
            {notSelectedCandidates.map((app,idx) => 
            <tr key={idx} className='border-2 border-black w-full'>
                <td className='border-2 border-black p-2'>{app.candidateName}</td>
                <td className='border-2 border-black p-2'>{app.courseName}</td>
            </tr>
            )}
        </tbody>
        </table>
    
    
    </>)
}