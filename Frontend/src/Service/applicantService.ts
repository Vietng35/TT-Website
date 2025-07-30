import { GetLeaderboardResponse, notSelectedApplicants, selectedApplicants } from "@/pages/Leaderboard";
import { GetApplicantsResponse } from "@/Utils/Submit";
import axios from "axios";


//Service of Applicant entity with api calls.
export const ApplicantService = {
    /**
     * 
     * @param searchTerm The keyword to search applicants
     * @param searchOption The option to search applicants
     * @param sortBy The preference to sort applicants
     * @returns Applicants applied to assigned courses by lecturerID
     */
    getApplicantbyChoice: async (searchTerm: string, searchOption: string, sortBy: string): Promise<GetApplicantsResponse> => {
        const encodedSearchTerm = encodeURIComponent(searchTerm)// Ensure special characters are handled properly
        
        try{
            const {data} = await axios.get(`http://localhost:3000/applicants?searchTerm=${encodedSearchTerm}&searchOption=${searchOption}&sortBy=${sortBy}`)
            return data;
        }catch(error){
            console.log(error)
            return [];
        }

    },

    /**
     * 
     * @param lectureId Lecturer's ID
     * @param sortBy The preference to sort applicants
     * @returns Applicants applied to lecturer assinged courses
     */

    getApplicantbyLecId: async (lectureId: number, sortBy: string): Promise<GetApplicantsResponse> => {
        try{
            const {data} = await axios.get(`http://localhost:3000/applicants/${lectureId}?sortBy=${sortBy}`)
            return data;
        }catch(error){
            console.log(error)
            return [];
        }
    },

    /**
     * 
     * @param limit The maximum candidates to retrieve
     * @param minSelectNum The minimum number of selection of an application.
     * @returns return GetLeaderboardResponse containing selectedApplicants array and notSelectedApplicants array
     */
    getApplicantWithSelectCount: async (limit: number, minSelectNum: number): Promise<GetLeaderboardResponse> => {
        try{
            const {data} = await axios.get(`http://localhost:3000/applicants/leaderboard?limit=${limit}&countNumber=${minSelectNum}`)
            console.log(data)
            return data
        }
        catch(error){
            console.log(error)
            return {selectedApplicants:[], notSelectedApplicants:[]};
        }
    },

    getApplicationById: async (applicantId: number): Promise<GetApplicantsResponse> =>{
        try{
            const {data} = await axios.get(`http://localhost:3000/profile/${applicantId}`);
            console.log(data)
            return data
        }
        catch(error){
            console.log(error)
            return [];
        }
    }
}