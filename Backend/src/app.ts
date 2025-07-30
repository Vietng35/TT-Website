import express from "express";
import { myDataSource } from "./app-data-source";
import cors from "cors";
import { changePassword, signInTutor, signUpTutor } from "./controllers/users";
import { getCourses } from "./controllers/courses";
import {
  checkApplicant,
  createApplicant,
  getApplicants,
  getApplicationbyID,
  getLeaderboard,
  selectApplicant,
  setApplicantRanking,
  updateComment,
} from "./controllers/applicants";

const app = express();
app.use(cors());
app.use(express.json());

//Init Database
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

//call back
app.post("/users/sign-up", async (req, res) => {
  const rs = await signUpTutor(req.body.email, req.body.password);
  res.send(rs);
});

/**
 * Authenticate an user with email and password
 */
app.post("/users/sign-in", async (req, res) => {
  const rs = await signInTutor(req.body.email, req.body.password);
  res.send(rs);
});

/**
 * Get courses by lecturer's ID
 */
app.get("/courses", async (req, res) => {
  const lectureId = req.query.lecture_id
    ? Number(req.query.lecture_id)
    : undefined;
  const rs = await getCourses(lectureId);
  res.send(rs);
});

/**
 * Validate applicant details
 * Create new applicant if details are valid
 */
app.post("/applicants", async (req, res) => {
  const rs = await checkApplicant(
    req.body.availability,
    req.body.role,
    req.body.credential,
    req.body.experience,
    req.body.skill,
    req.body.course
  );
  if (!rs.status) res.send(rs);
  const rsCreateApplicant = await createApplicant(req.body);
  res.send(rsCreateApplicant);
});


/**
 * Get Applicant by lecturer preferences by name, role, courses
 */
app.get("/applicants", async (req, res) => {
  const rs = await getApplicants(req.query);
  res.send(rs);
});

/**
 * Update select status of the application.
 */
app.post("/applicants/:lecturerId/select", async (req, res) => {
  const lecturerId = parseInt(req.params.lecturerId);
  const rs = await selectApplicant(
    lecturerId,
    req.body.applicantId,
    req.body.selected
  );
  res.send(rs);
});

/**
 * Update ranking of the application.
 */
app.post("/applicants/:lecturerId/ranking", async (req, res) => {
  const lecturerId = parseInt(req.params.lecturerId);
  const rs = await setApplicantRanking(
    lecturerId,
    req.body.applicantId,
    req.body.ranking
  );
  res.send(rs);
});

/**
 * Get assigned courses based on lecturer's ID
 */
app.get("/lecturers/:id/courses", async (req, res) => {
  const lectureId = Number(req.params.id);
  const rs = await getCourses(lectureId);
  res.json(rs);
});

/**
 * Update comments of the application
 */

app.post("/changepassword", async (req, res) => {
  const { email, newPassword } = req.body;
  const rs = await changePassword(email, newPassword);
  res.send(rs);
});

app.post("/applicants/:lecturerId/comment", async (req, res) => {
  const lecturerId = parseInt(req.params.lecturerId);
  const rs = await updateComment(lecturerId, req.body.applicantId, req.body.comment);
  res.send(rs);
});

/**
 * Get the most selected, the least selected and not selected applicants. 
 */
app.get("/applicants/leaderboard", async (req, res) => {
  const rs = await getLeaderboard(req.query);
  res.send(rs);
});

/**
 * Get applications by candidate ID
 */
app.get("/profile/:id", async (req, res) => {
  const rs = await getApplicationbyID(Number(req.params.id))
  res.send(rs)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Listening on 127.0.0.1:${PORT}`);
});
