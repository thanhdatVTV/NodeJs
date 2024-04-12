require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const { db } = require('./firebase.js');
const LecturerServices = require('./services/LecturerService');
const SubjectServices = require('./services/SubjectService');
const SemesterServices = require('./services/SemesterService');
const YearServices = require('./services/YearService');

//console.log(process.env);

const app = express();
const port = process.env.PORT || 3004;
const hostname = process.env.HOST_NAME;

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//config template engine
configViewEngine(app);

//Khai bao router
app.use('/', webRoutes);

app.use(express.json());

// var cors = require("cors");
// app.use(cors({
//     origin: "*",
// }));

//===>Giang vien<=== BEGIN//
app.get('/api/lecturers/get-list', LecturerServices.getList);

app.post('/api/lecturers/add-lecturers', LecturerServices.addLecturer);

app.post('/api/lecturers/update-lecturer', LecturerServices.updateLecturer);

app.post('/api/lecturers/delete-lecturer', LecturerServices.deleteLecturer);

//===>Giang vien<=== END//

//===>Mon hoc<=== START//

app.get('/api/subjects/get-list', SubjectServices.getList);

app.post('/api/subjects/add-subjects', SubjectServices.addSubject);

app.post('/api/subjects/update-subject', SubjectServices.updateSubject);

app.post('/api/subjects/delete-subject', SubjectServices.deleteSubject);

//===>Mon hoc<=== END//

//===>Hoc Ky<=== START//

app.get('/api/Semester/get-list', SemesterServices.getList);

app.post('/api/Semester/add-Semester', SemesterServices.addSemester);

app.post('/api/Semester/update-Semester', SemesterServices.updateSemester);

app.post('/api/Semester/delete-Semester', SemesterServices.deleteSemester);

//===>Hoc Ky<=== END//

//===>Nam<=== START//

app.get('/api/Year/get-list', YearServices.getList);

app.post('/api/Year/add-Year', YearServices.addYear);

app.post('/api/Year/update-Year', YearServices.updateYear);

app.post('/api/Year/delete-Year', YearServices.deleteYear);

//===>Nam<=== END//

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
