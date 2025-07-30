import { useApplicants } from '@/hooks/useApplicants'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CreateApplicantPayload } from '@/Utils/Submit'
import { useCourses } from '@/hooks/useCourses'

//Function will perform if the showSuccessSubmit is true
function SuccessSubmit() {
    return (
        <div className='border-1 rounded-2xl p-4  bg-blue-200 text-black mt-6 justify-center items-center flex m-auto'>
            Thank you for submitting!
        </div>
    )
}

//Function will perform if the showFailtoSubmit is true
function FailtoSubmit() {
    return (

        <div className='border-1 rounded-2xl p-4  bg-blue-200 text-black mt-6 justify-center items-center flex m-auto'>
            Please check your form again!
        </div>
    )
}

export default function Tutorpage() {
    const { user } = useAuth()
    const router = useRouter()
    const { createApplicant } = useApplicants({})
    const [courseId, setCourse] = useState("")
    const [availability, setTime] = useState("")
    const [skill, setSkill] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [experience, setExperience] = useState("");
    const [experienceArr, setExperienceArr] = useState<string[]>([]);
    const [credential, setCredential] = useState("");
    const [credentials, setCredentials] = useState<string[]>([]);
    const [role, setRole] = useState("");

    const courses = useCourses()

    const [showSuccessSubmit, setShowSuccessSubmit] = useState(false)
    const [showFailtoSubmit, setFailtoSubmit] = useState(false)
    const [experienceInputError, setExperienceInputError] = useState("");
    const [academicInputError, setAcademicInputError] = useState("");
    const [skillInputError, setSkillInputEror] = useState("");

    const validationPattern = /^(.+?)\s*-\s*(.+?)\s*-\s*(\d{4})\s*-\s*(\d{4}|Present|Now)$/

    // Effect to check that the current user has the "Tutor" role or not.
    // If not, it redirects to an unauthorized page.
    useEffect(() => {
        if (!user) {
            router.replace("/login")
        }

        if (user && user.role !== "Tutor") {
            router.replace("/unauthorized");
        }
    }, [router, user]);

    //Function to handle when the tutor form submitted successfully
    const handleform = async (e: React.FormEvent) => {
        e.preventDefault(); // Avoid reload

        setShowSuccessSubmit(false)
        setFailtoSubmit(false)


        //Checking if these conditions all true
        if (Boolean(academicInputError || experienceInputError)) {
            setFailtoSubmit(true);
        }
        else {//Check if user inputs are valid and not empty
            if (courseId && availability && skills && credentials && experienceArr && user && role) {
                //userData will store the data when it is initialize
                const userData: CreateApplicantPayload = { courseId: Number(courseId), availability: availability, role: role, skill: skills.join(","), credential: credentials.join(","), experience: experienceArr.join(","), tutorId: user.id }

                //Update createApplicant with userData is deploymented in the useApplicants (custom hooks)
                const rs = await createApplicant(userData)
                if (!rs) {
                    return;
                }

                //Update the state 
                setShowSuccessSubmit(true)

                // Reset the arrays after successful submission.
                setCourse("");
                setTime("");
                setSkills([]);
                setExperienceArr([]);
                setCredentials([]);
                setRole("");
            }
            else {
                const allowed_Availability = ["Full Time", "Part Time"];
                const allowed_Role = ["Tutor", "Lab Assistant"];

                //validate Availability
                if (!allowed_Availability.includes(availability)) alert(
                    "Users do not choose any availability"
                )

                if (!allowed_Role.includes(role)) alert(
                    "Users do not choose any role"
                )

                //validate credential
                const credentiaAndExperiencePattern = /^(.+?)\s*-\s*(.+?)\s*-\s*(\d{4})\s*-\s*(\d{4}|Present|Now)$/
                console.log(credential, credential.match(credentiaAndExperiencePattern))
                if (!credential.match(credentiaAndExperiencePattern)) alert(
                    "Please adjust right form"
                )

                const ifMMatch = credential.match(credentiaAndExperiencePattern)
                if (ifMMatch) {
                    const [, , , Startyear, Endyear] = ifMMatch
                    //EndYear < StartYear
                    if (Endyear < Startyear) alert(
                        "End Year must be greater or equal to Start Year"
                    )
                }

                //validate experience
                if (!experience.match(credentiaAndExperiencePattern)) alert(
                    "Pleasr adjust right form"
                )

                const ifMatchExperience = experience.match(credentiaAndExperiencePattern)
                if (ifMatchExperience) {
                    const [, , , StartYear, EndYear] = ifMatchExperience
                    //EndYear < StartYear
                    if (EndYear < StartYear) alert(
                        "End Year must be greater or equal to Start Year"
                    )
                }
                setFailtoSubmit(true)
            }
        }
    }

    /*
      handleSkillForm:
      - Monitors the keyboard input for skills.
      - When Enter key is pressed and the input (skill) is non-empty,
        it adds the skill to the skills array and resets the input.
    */
    const handleSkillForm = (k: React.KeyboardEvent) => {

        if (k.key == "Enter" && skill.trim() != "") {
            k.preventDefault();

            //Check if skill exists in the list
            if (!skills.find(d => d == skill.trim())) {
                setSkills(skills => [...skills, skill]);//if not, add to the list
                setSkill("");
            }
            else {
                setSkillInputEror("Already added!")//if exists, show error
            }
        }
    }

    /*
      handleExperienceForm:
      - Monitors the keyboard input for Experience.
      - When Enter key is pressed and the input (Experience) is non-empty,
        it adds the experience to the experienceArr array and resets the input.
    */
    const handleExperienceForm = (k: React.KeyboardEvent) => {
        if (k.key == "Enter" && experience.trim() != "") {
            k.preventDefault();

            //Input must follow format "Name of Company - Name of Position - Start Year - End Year"
            if (validationPattern.test(experience)) {
                if (experienceArr.find(a => a == experience)) {//check if input is already existed in the list
                    setExperienceInputError("Already Added")
                }
                else {
                    const ifMatched = experience.match(validationPattern)

                    if (ifMatched) {
                        const [, Institution, Certificate, StartYear, EndYear] = ifMatched
                        console.log(Institution, Certificate)
                        if (EndYear < StartYear) {
                            setExperienceInputError("End Year must be greater or equal to Start Year")//Check endYear if 
                        }
                        else {
                            setExperienceArr(experienceArr => [...experienceArr, experience.trim()]);
                            setExperience("");
                        }
                    }
                }
            }
            else {
                setExperienceInputError("Invalid Format"); //Error will be shown if failed to follow
            }

        }
    }

    /*
      handleCredentialForm:
      - Monitors the keyboard input for Credential.
      - When Enter key is pressed and the input (Credential) is non-empty (after trimming),
        it adds the credential to the credentials array and resets the input.
    */
    const handleCredentialForm = (k: React.KeyboardEvent) => {

        if (k.key == "Enter" && credential.trim() != "") {
            k.preventDefault();

            //Input must follow format "Name of Insitution - Name of Certificate - Start Year - End Year"
            if (validationPattern.test(credential)) {
                if (credentials.find(a => a == credential)) {
                    setAcademicInputError("Already Added")
                }
                else {
                    const ifMatched = credential.match(validationPattern)
                    if (ifMatched) {
                        const [, , , StartYear, EndYear] = ifMatched
                        if (EndYear < StartYear) {
                            setAcademicInputError("End Year must be greater or equal to Start Year")
                        }
                        else {
                            setCredentials(credentials => [...credentials, credential.trim()]);
                            setCredential("");
                        }
                    }
                }
            }
            else {
                setAcademicInputError("Invalid Format") //Error will be shown if failed to follow
            }
        }
    }

    //Function to remove the skills , or experience, or credential
    const removeSkills = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    }

    const removeExperience = (index: number) => {
        setExperienceArr(experienceArr.filter((_, i) => i !== index));
    }

    const removeCredentials = (index: number) => {
        setCredentials(credentials.filter((_, i) => i !== index));
    }

    return (
        <>
            <div className='py-5 px-20 mb-10'>
                <div className=' justify-center items-center flex font-bold w-full h-full text-2xl mb-5'>FORM</div>

                <form onSubmit={handleform} className='flex flex-col gap-7 rounded-lg shadow-md border border-gray-300 py-5 px-10'>
                    <select className='p-2 py-4 px-10 border rounded bg-amber-50 border-amber-400 text-amber-900'
                        value={courseId}
                        onChange={e => setCourse(e.target.value)}>

                        <option value="">-- Select The Courses</option>
                        {courses.map(courseObject => <option key={courseObject.id} value={courseObject.id}>{courseObject.name} </option>)}

                    </select>

                    <select name="" id="" className='p-2 py-4 px-10 border rounded bg-amber-50 border-amber-400 text-amber-900'
                        value={availability}
                        onChange={e => setTime(e.target.value)}
                    >
                        <option value="">-- Select Availability</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                    </select>

                    <select name="" id="" className='p-2 py-4 px-10 border rounded bg-amber-50 border-amber-400 text-amber-900'
                        value={role}
                        onChange={e => setRole(e.target.value)}
                    >
                        <option value="">-- Select Role</option>
                        <option value="Tutor">Tutor</option>
                        <option value="Lab Assistant">Lab Assistant</option>
                    </select>

                    <div className='p-4 flex flex-wrap py-4 px-10 border rounded bg-amber-50 border-amber-400 text-amber-900 items-center gap-2'>
                        <label className='font-bold mb-2'>Skills: </label>
                        {skills ? skills.map((skill, index) => (
                            <>
                                <div className='px-2 py-1 border rounded-md bg-amber-400 hover:bg-amber-200'>
                                    {skill}
                                    <button type="button" className='pl-1 hover:cursor-pointer' onClick={() => removeSkills(index)}><strong>X</strong></button>
                                </div>
                            </>
                        )) : <></>}

                        <input className='p-2 border-2 rounded-md hover:bg-amber-50 w-full' type="text" list="skills" placeholder='Press Enter to add skills'
                            onChange={(e) => { setSkill(e.target.value); setSkillInputEror("") }} onKeyDown={handleSkillForm} value={skill}></input>

                        <span className='mt-2'>{skillInputError ? <><strong className='text-red-500'>{skillInputError}</strong></> : <></>}</span>


                    </div>

                    <datalist id="skills">
                        <option>-SUGGESTED SKILLS-</option>
                        <option>Leadership</option>
                        <option>Time Managament</option>
                        <option>Problem Solving</option>
                        <option>Teamwork</option>
                    </datalist>

                    <div className='p-4 flex flex-wrap py-4 px-10 border rounded bg-amber-50 border-amber-400 text-amber-900 items-center gap-2'>
                        <label className='font-bold mb-2'>Academic Credentials: </label>
                        {credentials ? credentials.map((credential, index) => (
                            <>
                                <div className='px-2 py-1 border rounded-md bg-amber-400 hover:bg-amber-200'>{credential}<button type="button" className='pl-1 hover:cursor-pointer' onClick={() => removeCredentials(index)}><strong>X</strong></button></div>
                            </>
                        )) : <></>}
                        <input className='p-2 border-2 rounded-md hover:bg-amber-50 w-full' type="text" placeholder='Press Enter to add'
                            onChange={(e) => { setCredential(e.target.value); setAcademicInputError("") }} onKeyDown={handleCredentialForm} value={credential}></input>

                        <span className='mt-2'>{academicInputError ? <><strong className='text-red-500'>{academicInputError}</strong> - </> : <></>}
                            Please enter in the following format: '<strong>Institution</strong> - <strong>Certificate</strong> - <strong>Start Year</strong> - <strong>End Year</strong>'</span>

                    </div>

                    <div className='p-4 flex flex-wrap py-4 px-10 border rounded bg-amber-50 border-amber-400 text-amber-900 items-center gap-2'>
                        <label className='font-bold mb-2'>Experience: </label>
                        {experienceArr ? experienceArr.map((exp, index) => (
                            <>
                                <div className='px-2 py-1 border rounded-md bg-amber-400 hover:bg-amber-200'>{exp}<button type="button" className='pl-1 hover:cursor-pointer' onClick={() => removeExperience(index)}><strong>X</strong></button></div>
                            </>
                        )) : <></>}
                        <input className='p-2 border-2 rounded-md hover:bg-amber-50 w-full' type="text" placeholder='Press Enter to add'
                            onChange={(e) => { setExperience(e.target.value); setExperienceInputError("") }} onKeyDown={handleExperienceForm} value={experience}></input>

                        <span className='mt-2'>{experienceInputError ? <><strong className='text-red-500'>{experienceInputError}</strong> - </> : <></>}
                            Please enter in the following format: '<strong>Company</strong> - <strong>Position</strong> - <strong>Start Year</strong> - <strong>End Year</strong>'</span>

                    </div>

                    <button type="submit" className=' border px-4 py-2 m-auto border-black text-black rounded hover:border-amber-700 hover:duration-300 hover:text-amber-700'>
                        Apply
                    </button>
                    {showSuccessSubmit && <SuccessSubmit />}
                    {showFailtoSubmit && <FailtoSubmit />}
                </form>
            </div>
        </>

    )
}
