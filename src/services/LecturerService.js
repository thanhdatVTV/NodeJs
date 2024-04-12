// GiangVienServices.js

const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;

        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let lecturersRef = db.collection('tbl_GiangVien');

        // Apply keyword filter if provided
        if (keyword) {
            lecturersRef = lecturersRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        lecturersRef = lecturersRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await lecturersRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const lecturers = [];
        snapshot.forEach((doc) => {
            lecturers.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: lecturers,
            totalRecord: lecturers.length // You might need to adjust this depending on your actual total record count
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

async function addLecturer(req, res) {
    try {
        const {MaGV, TenGV} =
            req.body;

        // Check if MaGV or TenGV is undefined
        if (!MaGV || !TenGV) {
            return res.status(400).send({
                status: 0,
                message: 'MaGV or TenGV is missing',
                response: null,
                totalRecord: 0
            });
        }

        // Check if MaGV already exists
        const existingLecturer = await db.collection('tbl_GiangVien').where('MaGV', '==', MaGV).get();
        if (!existingLecturer.empty) {
            const resultViewModel = {
                status: 0,
                message: 'MaGV already exists',
                response: null,
                totalRecord: 0
            };
            return res.status(200).send(resultViewModel);
        }

        const lecturerData = {
            Status: 1,
            UserUpdated: "",
            TenGV,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateUpdated: new Date(),
            MaGV,
            UserCreated: "",
            IsDelete: false,
            // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_GiangVien').add(lecturerData);

        const resultViewModel = {
            status: 1,
            message: 'Thêm mới thành công',
            response: `Lecturer added with ID: ${docRef.id}`,
            totalRecord: 1
        };

        res.status(201).send(resultViewModel);
    } catch (error) {
        console.error('Error adding lecturer: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function updateLecturer(req, res) {
    try {
        const { Id, TenGV, MaGV } = req.body;

        // Validate required parameters if needed
        // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
        //     return res.status(400).send("Missing required parameters");
        // }

        const lecturerRef = db.collection('tbl_GiangVien').doc(Id);

        // Check if the document exists
        const doc = await lecturerRef.get();
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
        await lecturerRef.update({
            UserUpdated: '',
            TenGV,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
            DateUpdated: new Date(),
            MaGV,
        });

        const resultViewModel = {
            status: 1,
            message: 'Lecturer information updated successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error updating lecturer information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function deleteLecturer(req, res) {
    try {
        const { Id } = req.body;

        const lecturerRef = db.collection('tbl_GiangVien').doc(Id);

        // Check if the document exists
        const doc = await lecturerRef.get();
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
        await lecturerRef.update({
            IsDelete: true,
        });

        const resultViewModel = {
            status: 1,
            message: 'Lecturer information delete successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error delete lecturer information: ', error);
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
    addLecturer,
    updateLecturer,
    deleteLecturer
};
