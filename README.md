# s4097536-s3966848-a2
Full Stack Development Assignment 2

The first project is designed for candidates can apply to tutor and lab assistant, and the lecturers can select suitable candidates for the courses listed on the website.
The second project is designed for administrators to manage TT Website such as assigning lecturers, modifying courses and managing access of lecturers and candidates. 

Developers:
Quoc Cuong Pham (s3966848@student.rmit.edu.vn)

Viet Nguyen (s4097536@student.rmit.edu.au)

Link to Git repo: https://github.com/rmit-fsd-2025-s1/s4097536-s3966848-a2

**HOW TO RUN**
Make sure you run the backend first, otherwise, frontend will use backend port that causes errors
- Installing dependencies
  ```npm install```
- Running the frontend
  ```npm run dev ```
- Running the backend
  ```npm run start ```

**Note**
Backend folder runs at port 3000
Admin Backend folder runs at 4000

**FEATURE**

There are 3 roles in the projects: Candidates, Lecturers and Admins:
  - Candidates: 
    - Candidates apply to the courses they wish with maximum of two roles - Tutor and Lab Assistant.
    - Candidates can impress the lecturers by showing their unique skills, credentials and valuable experience.
  - Lecturers:
    - Lecturers can review application from candidates to select talented candidates
    - Lecturers can search by name, course, skills, roles or availability to find suitable candidates
    - The website honors talented candidates by honoring candidate's names on the Leaderboard page so that all lecturers can see who have the most and the least chosen, also they can view who have not been selected so they can give them a chance.
  - Admins:
    - Admins have ability to modify courses including adding, removing and changing details
    - Admins can assign a lecturer to a course
    - Admins can block access of candidates and lecturers if they violate policies.

**Assumption**
- Blocked users will not be able to login their accounts and blocked candidates have a warning "Unavailable" in the application
- Blocked candidates can be selected and noted by lecturers as they may want to get in touch with the candidates, however, they will not be honored in the Leaderboard page. 
- Lecturers can not register themselves due to security reasons. They must request access from admins.

In this project, we use:
- Frontend: React TS, Tailwind CSS.
- Backend: Node & Express with TypeORM
- Relational Database: Cloud MySQL

Default Accounts:
Username: "admin", Password: "admin", Role: "Admin"

Username: "exampleLecturer@rmit.edu.au", Password: "ExampleLecturer123?", Role: "Lecturer"

Username: "exampleCandidate@rmit.edu.au", password: "ExampleCandidate456?", role:"Candidate"

**REFERENCES**
 - https://nextjs.org
 - https://www.w3schools.com
 - https://react.dev/
 - https://www.w3resource.com/javascript/form/password-validation.php
 - COSC2758 - Full Stack Development - Lectorials/Tutorials (Week 7-10)
 - COSC2758 - Full Stack Development - Lectorials/Tutorials (Week 11) for DI charts and HD part: graphQL and Subscriptions
 - Button images are used from Bootstrap website: https://icons.getbootstrap.com/ 
 - https://www.tutorialspoint.com/typeorm/typeorm_query_builder.htm 
 - Generative AI such as ChatGPT are used for debugging, generating ideas.

Thank you!
We feel grateful for your advises and feedbacks. From the bottom of our hearts, we would love to hear your comments about this project to exchange and improve skills we are not good at. Each of your feedback is a precious gift to us. Wish all the best to you!.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

