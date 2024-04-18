require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const { db } = require('./firebase.js');
const LecturerServices = require('./services/LecturerService');
const SubjectServices = require('./services/SubjectService');
const SubjectGroupServices = require('./services/SubjectGroupService');
const SemesterServices = require('./services/SemesterService');
const YearServices = require('./services/YearService');
const MajorServices = require('./services/MajorService');
const CoSoService = require('./services/CoSoService');
const ToaNhaService = require('./services/ToaNhaService');
const PhongService = require('./services/PhongService');
const NhomLopService = require('./services/NhomLopService');
const LichThiService = require('./services/LichThiService');
const KhoaService = require('./services/KhoaService');
const DotDangKyService = require('./services/DotDangKyService');
const LoginService = require('./services/LoginService');
const EducationProgramService = require('./services/EducationProgramService');

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

app.post('/api/User/Login', LoginService.login);

//===>Giang vien<=== BEGIN//
app.get('/api/lecturers/get-list', LecturerServices.getList);

app.post('/api/lecturers/add-lecturers', LecturerServices.addLecturer);

app.post('/api/lecturers/update-lecturer', LecturerServices.updateLecturer);

app.post('/api/lecturers/delete-lecturer', LecturerServices.deleteLecturer);

//===>Giang vien<=== END//

//===>Giang vien<=== BEGIN//
app.get('/api/testschedules/get-list', LichThiService.getList);

app.post('/api/testschedules/add-testschedules', LichThiService.addLichThi);

app.post('/api/testschedules/update-testschedules', LichThiService.updateLichThi);

app.post('/api/testschedules/delete-testschedules', LichThiService.deleteLichThi);

//===>Giang vien<=== END//

//===>Mon hoc<=== START//

app.get('/api/subjects/get-list', SubjectServices.getList);

app.post('/api/subjects/add-subjects', SubjectServices.addSubject);

app.post('/api/subjects/update-subject', SubjectServices.updateSubject);

app.post('/api/subjects/delete-subject', SubjectServices.deleteSubject);

//===>Mon hoc<=== END//

//===>Nhom mon hoc<=== START//

app.get('/api/subjectgroups/get-list', SubjectGroupServices.getList);

app.post('/api/subjectgroups/add-subjectgroups', SubjectGroupServices.addSubjectGroup);

app.post('/api/subjectgroups/update-subjectgroup', SubjectGroupServices.updateSubjectGroup);

app.post('/api/subjectgroups/delete-subjectgroup', SubjectGroupServices.deleteSubjectGroup);

//===>Nhom mon hoc<=== END//

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

//===>NganhHoc<=== START//

app.get('/api/Major/get-list', MajorServices.getList);

app.post('/api/Major/add-Major', MajorServices.addMajor);

app.post('/api/Major/update-Major', MajorServices.updateMajor);

app.post('/api/Major/delete-Major', MajorServices.deleteMajor);

//===>NganhHoc<=== END//

//===>Co so<=== START//

app.get('/api/co-so/get-list', CoSoService.getList);

app.post('/api/co-so/add-co-so', CoSoService.addCoSo);

app.post('/api/co-so/update-co-so', CoSoService.updateCoSo);

app.post('/api/co-so/delete-co-so', CoSoService.deleteCoSo);

//===>Co so<=== END//
//jhnefueyfbsufbyufu

//===>Toa Nha<=== START//

app.get('/api/toa-nha/get-list', ToaNhaService.getList);

app.post('/api/toa-nha/add-toa-nha', ToaNhaService.addToaNha);

app.post('/api/toa-nha/update-toa-nha', ToaNhaService.updateToaNha);

app.post('/api/toa-nha/delete-toa-nha', ToaNhaService.deleteToaNha);

//===>Toa Nha<=== END//

//===>Phong<=== START//

app.get('/api/phong/get-list', PhongService.getList);

app.post('/api/phong/add-phong', PhongService.addPhong);

app.post('/api/phong/update-phong', PhongService.updatePhong);

app.post('/api/phong/delete-phong', PhongService.deletePhong);

//===>Phong<=== END//

//===>Nhom Lop<=== START//

app.get('/api/nhom-lop/get-list', NhomLopService.getList);

app.post('/api/nhom-lop/add-nhom-lop', NhomLopService.addNhomLop);

app.post('/api/nhom-lop/update-nhom-lop', NhomLopService.updateNhomLop);

app.post('/api/nhom-lop/delete-nhom-lop', NhomLopService.deleteNhomLop);

//===>Nhom Lop<=== END//

//===>Lich Thi<=== START//

app.get('/api/nhom-lop/get-list', LichThiService.getList);

app.post('/api/nhom-lop/add-nhom-lop', LichThiService.addLichThi);

app.post('/api/nhom-lop/update-nhom-lop', LichThiService.updateLichThi);

app.post('/api/nhom-lop/delete-nhom-lop', LichThiService.deleteLichThi);

//===>Lich Thi<=== END//

//===>Khoa<=== START//

app.get('/api/Khoa/get-list', KhoaService.getList);

app.post('/api/Khoa/add-Khoa', KhoaService.addKhoa);

app.post('/api/Khoa/update-Khoa', KhoaService.updateKhoa);

app.post('/api/Khoa/delete-Khoa', KhoaService.deleteKhoa);

//===>Khoa<=== END//

//===>Khoa<=== START//

app.get('/api/dot-dang-ky/get-list', DotDangKyService.getList);

app.post('/api/dot-dang-ky/add-dot-dang-ky', DotDangKyService.addDotDangKy);

app.post('/api/dot-dang-ky/update-dot-dang-ky', DotDangKyService.updateDotDangKy);

app.post('/api/dot-dang-ky/delete-dot-dang-ky', DotDangKyService.deleteDotDangKy);

//===>Khoa<=== END//

//===>Chuong Trinh Dao Tao<=== START//

app.get('/api/EducationProgram/get-list', EducationProgramService.getList);

app.post('/api/EducationProgram/add-EducationProgram', EducationProgramService.addEduProgram);

app.post('/api/EducationProgram/update-EducationProgram', EducationProgramService.updateEduProgram);

app.post('/api/EducationProgram/delete-EducationProgram', EducationProgramService.deleteEduProgram);

//===>Chuong Trinh Dao Tao<=== END//

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
