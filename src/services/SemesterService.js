// HocKyServices.js

const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;


        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let SemesterRef = db.collection('tbl_HocKy');

        // Apply keyword filter if provided
        if (keyword) {
            SemesterRef = SemesterRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        SemesterRef = SemesterRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await SemesterRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const Semester = [];
        snapshot.forEach((doc) => {
            Semester.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: Semester,
            totalRecord: Semester.length // You might need to adjust this depending on your actual total record count
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error getting documents: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function addSemester(req, res) {
    try {
        const { HocKy, UserUpdated, DateUpdated, UserCreated, IsDelete, DateCreated } =
            req.body;

        // Check if MaGV already exists
        const existingSemester = await db.collection('tbl_HocKy').where('HocKy', '==', HocKy).get();
        if (!existingSemester.empty) {
            const resultViewModel = {
                status: 0,
                message: 'HocKy already exists',
                response: null,
                totalRecord: 0
            };
            return res.status(200).send(resultViewModel);
        }

        const SemesterData = {
            HocKy,
            UserUpdated,
            DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            UserCreated,
            IsDelete,
            DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
        };

        const docRef = await db.collection('tbl_HocKy').add(SemesterData);

        const resultViewModel = {
            status: 1,
            message: 'Thêm mới thành công',
            response: `Semester added with ID: ${docRef.id}`,
            totalRecord: 1
        };

        res.status(201).send(resultViewModel);
    } catch (error) {
        console.error('Error adding Semester: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function updateSemester(req, res) {
    try {
        const { Id, HocKy, UserUpdated, DateUpdated} = req.body;

        // Validate required parameters if needed
        // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
        //     return res.status(400).send("Missing required parameters");
        // }

        const SemesterRef = db.collection('tbl_HocKy').doc(Id);

        // Check if the document exists
        const doc = await SemesterRef.get();
        if (!doc.exists) {
            const resultViewModel = {
                status: 0,
                message: 'Document not found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        // Update the document with the provided data
        await SemesterRef.update({
            UserUpdated,
            HocKy,
            DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6)
        });

        const resultViewModel = {
            status: 1,
            message: 'Semester information updated successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error updating Semester information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function deleteSemester(req, res) {
    try {
        const { Id } = req.body;

        const SemesterRef = db.collection('tbl_HocKy').doc(Id);

        // Check if the document exists
        const doc = await SemesterRef.get();
        if (!doc.exists) {
            const resultViewModel = {
                status: 0,
                message: 'Document not found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        // Update the document with the provided data
        await SemesterRef.update({
            IsDelete: true,
        });

        const resultViewModel = {
            status: 1,
            message: 'Semester information delete successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error delete Semester information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

module.exports = {
    getList,
    addSemester,
    updateSemester,
    deleteSemester
};
