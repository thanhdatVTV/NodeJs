require('dotenv').config();
const express = require('express')
const configViewEngine = require('./config/viewEngine');
const webRoutes = require('./routes/web');
const { db } = require('./firebase.js')

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

app.use(express.json())

// var cors = require("cors");
// app.use(cors({
//     origin: "*",
// }));

//===>Giang vien<=== BEGIN//

app.get('/api/lecturers/get-list', async (req, res) => {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;

        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let lecturersRef = db.collection("tbl_GiangVien");

        // Apply keyword filter if provided
        if (keyword) {
            lecturersRef = lecturersRef.where("fieldName", "==", keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        lecturersRef = lecturersRef.where("IsDelete", "!=", true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await lecturersRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            return res.status(404).send("No documents found");
        }

        const lecturers = [];
        snapshot.forEach(doc => {
            lecturers.push({
                id: doc.id,
                data: doc.data()
            });
        });

        res.status(200).send(lecturers);
    } catch (error) {
        console.error("Error getting documents: ", error);
        res.status(500).send("Internal Server Error");
    }
});

// Tạo mới giảng viên
app.post('/api/lecturers/add-lecturers', async (req, res) => {
    try {
        const {
            Status,
            UserUpdated,
            TenGV,
            DateUpdated,
            MaGV,
            UserCreated,
            IsDelete,
            DateCreated,
        } = req.body;

        const lecturerData = {
            Status,
            UserUpdated,
            TenGV,
            DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            MaGV,
            UserCreated,
            IsDelete,
            DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6) // Convert Firestore timestamp to JavaScript Date
        };

        const docRef = await db.collection("tbl_GiangVien").add(lecturerData);

        res.status(201).send(`Lecturer added with ID: ${docRef.id}`);
    } catch (error) {
        console.error("Error adding lecturer: ", error);
        res.status(500).send("Internal Server Error");
    }
});


//Sua thong tin Giang Vien
app.post('/api/lecturers/update-lecturer', async (req, res) => {
    try {
        const {
            Id,
            UserUpdated,
            TenGV,
            DateUpdated,
            MaGV
        } = req.body;

        // Validate required parameters
        // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
        //     return res.status(400).send("Missing required parameters");
        // }

        const lecturerRef = db.collection("tbl_GiangVien").doc(Id);

        // Check if the document exists
        const doc = await lecturerRef.get();
        if (!doc.exists) {
            return res.status(404).send("Document not found");
        }

        // Update the document with the provided data
        await lecturerRef.update({
            UserUpdated,
            TenGV,
            DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
            MaGV
        });

        res.status(200).send("Lecturer information updated successfully");
    } catch (error) {
        console.error("Error updating lecturer information: ", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/api/lecturers/delete-lecturer', async (req, res) => {
    try {
        const {
            Id
        } = req.body;

        const lecturerRef = db.collection("tbl_GiangVien").doc(Id);

        // Check if the document exists
        const doc = await lecturerRef.get();
        if (!doc.exists) {
            return res.status(404).send("Document not found");
        }

        // Update the document with the provided data
        await lecturerRef.update({
            IsDelete: true
        });

        res.status(200).send("Lecturer information delete successfully");
    } catch (error) {
        console.error("Error delete lecturer information: ", error);
        res.status(500).send("Internal Server Error");
    }
});



//===>Giang vien<=== END//


//SinhVien An

//

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})


