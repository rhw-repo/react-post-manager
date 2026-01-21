# Campaign Dashboard (Beta MVP)

---

### [Latest live demo](https://frontend-staging-c7dd.up.railway.app/Signup/)

## Technologies & Tools:

**Frontend**:

- React (Vite)
- react-router-dom
- React Table v7 ('Tanstack Table' in JavaScript)
- DOM Purify
- styled-components
- react-toastify, react-date-range, react-tooltips, react-select

**Backend**:

- Node.js
- Express (Sessions, Validator, Helmet, CORS)
- Database: MongoDB with Mongoose schema

**Dev & Ops:**

- Docker & Docker-Compose
- Git & GitHub
- ESLint, Prettier, Postman

**Design:**

- Early prototypes in Figma
- Code samples from Create React App migrated to Vite

## Sample of Challenges

- Styling library components required styled-components instead of conventional CSS.
- Connecting library components from different libraries to work together. Worked with a frontend mentor to filter the react-table (Tanstack Table v7) dashboard with a react-select component.
- Creating secure authorisation for login, signup and routes to replace temporary proxy with JWTs sent to local storage in dev phase.
- Research & implementation server side session authorisation with cookies.
- Researching why nginx reverse proxy was not working as expected in deployment and Railway.com's automatic containerization
- Fixing unexpected bugs found after deployment in code which ran in local development.
- Updating packages after deployment. Research on various CSVs.
- Updating server side code to handle increasing opt ins to blocking of 3rd party cookies affecting authorization for routes
- Iterating on CSS and layout to improve UX - for example, users could not see all of the text in tags. Implemented both react-tooltips and responsive design solutions to display all of tag text.

---

## Client:

Financial products, small marketing team. Requested demo for potential feedback on functionality and additional features.

### Status: BETA

- 3rd iteration: refactor CSS to improve responsive design and layout, deployed
- 2nd iteration: replace local development authorization (JWTs in local storage) with server side sessions (Express Session), deployed
- 1st iteration: local development minimally responsive CSS, focus on functionality

---

### Role & Contributions

**Sole Full-stack Developer**

**Security & Quality**

- Session management
- Input validation
- Security headers
- Linting & formatting

**Deployment**

- Initial staged deployment for validation on Railway

**Proceses**

- UI design in Figma
- Front-end implementation with React/Vite
- Back-end development in Express
- Data modeling in MongoDB

---

### Key Features

- Authentication & protected routes
- CRUD operations
- Dashboard Table: Four independent filters for isolated or combined searches
- Reponsive & accessible.

---

### Overview

Problem:
Freelancers and SMEs struggle to filter and track publicity in spreadsheets, and lack time to learn complex tools.
Spreadsheets don't provide enough filtering.

Solution:
Dashboard web app with intuitive Create, Read, Update and Delete (CRUD) operations.
4 independent table filters for isolated searching or cumulative filtering.
Designed for immediate use—no tutorials required.
Fully responsive & accessible: works on any device, built using WCAG guidelines.

---

## Connect

[LinkedIn](https://www.linkedin.com/in/ruth-westnidge/)
