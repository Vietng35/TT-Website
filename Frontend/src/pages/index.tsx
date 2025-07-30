import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <>
      <div className="px-32 pt-5 pb-15">
        {user && <div className="text-center flex flex-col items-center gap-2 border rounded bg-amber-100 border-amber-400 px-10 py-3 text-amber-900">
          <div className="text-lg">Hi <strong>{user.name}</strong>, have a good day!</div>
        </div>}
        <div className="font-bold text-3xl text-center mt-5">Welcome To The Website</div><br></br>
        <div className="px-10 py-5">
          <div className="font-bold text-2xl">About Us</div>
          <div className="text-xl">
            This is the place where undergraduate and postgraduate students use their skills and experience to assist lecturers to deliver effective and smooth teaching sessions.
          </div>

        </div>

        <div className="flex flex-row mt-10 gap-10">
          <div className="border rounded bg-amber-100 border-amber-400 px-10 py-5 text-amber-900 basis-1/2">
            <div className="text-2xl font-bold">
              If you are a tutor:
            </div>
            <ul className="text-xl list-disc pl-5 mt-5">
              <li>Proceed to Apply button on the header to start an applicantion to the course you would like to provide assistance.</li>
              <li>Polish your application by giving impressive academic credentials or sharing your valuable experience to the lecturer in the application form.</li>
              <li>Once your application is submitted, lecturers will review your application and decide whether to select or not.</li>
              <li>During review process, you should wait for notification from lecturers.</li>
            </ul>
          </div>

          <div className="border rounded bg-amber-100 border-amber-400 px-10 py-5 text-amber-900 basis-1/2">
            <div className="text-2xl font-bold">
              If you are a lecturer:
            </div>
            <ul className="text-xl list-disc pl-5 mt-5">
              <li>Proceed to Manangement For Admin to review applications from talented candidates.</li>
              <li>You can use search by course, name, role or skills to find candidates who you believe to be supportive.</li>
              <li>If found suitable candidates, you can select their applications and rank them to show your preferences.</li>
              <li>You can leave a note at the application so that other lecturers know what you think about that application.</li>
              <li>You can proceed to Leaderboard to see the most selected application, the least selected application and candidates have not got selected yet.</li>
            </ul>

          </div>
        </div>
      </div>
    </>
  );
}
