// NamHocServices.js

const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;


        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let YearRef = db.collection('tbl_NamHoc');

        // Apply keyword filter if provided
        if (keyword) {
            YearRef = YearRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        YearRef = YearRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await YearRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const Year = [];
        snapshot.forEach((doc) => {
            Year.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: Year,
            totalRecord: Year.length // You might need to adjust this depending on your actual total record count
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

async function addYear(req, res) {
    try {
        const { MaNamHoc, NamHoc } =
            req.body;

        // Check if MaGV or TenGV is undefined
        if (!MaNamHoc || !NamHoc) {
            return res.status(400).send({
                status: 0,
                message: 'MaNamHoc or NamHoc is missing',
                response: null,
                totalRecord: 0
            });
        }

        // Check if MaGV already exists
        const existingYear = await db.collection('tbl_NamHoc').where('NamHoc', '==', NamHoc).get();
        if (!existingYear.empty) {
            const resultViewModel = {
                status: 0,
                message: 'NamHoc already exists',
                response: null,
                totalRecord: 0
            };
            return res.status(200).send(resultViewModel);
        }

        const YearData = {
            Status: 1,
            UserUpdated: "",
            NamHoc,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateUpdated: new Date(),
            MaNamHoc,
            UserCreated: "",
            IsDelete: false,
            // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_NamHoc').add(YearData);

        const resultViewModel = {
            status: 1,
            message: 'Thêm mới thành công',
            response: `Year added with ID: ${docRef.id}`,
            totalRecord: 1
        };

        res.status(201).send(resultViewModel);
    } catch (error) {
        console.error('Error adding Year: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function updateYear(req, res) {
    try {
        const { Id, MaNamHoc, NamHoc } = req.body;

        // Validate required parameters if needed
        // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
        //     return res.status(400).send("Missing required parameters");
        // }

        const YearRef = db.collection('tbl_NamHoc').doc(Id);

        // Check if the document exists
        const doc = await YearRef.get();
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
        await YearRef.update({
            UserUpdated: '',
            NamHoc,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
            DateUpdated: new Date(),
            MaNamHoc,
        });

        const resultViewModel = {
            status: 1,
            message: 'Year information updated successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error updating Year information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function deleteYear(req, res) {
    try {
        const { Id } = req.body;

        const YearRef = db.collection('tbl_NamHoc').doc(Id);

        // Check if the document exists
        const doc = await YearRef.get();
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
        await YearRef.update({
            IsDelete: true,
        });

        const resultViewModel = {
            status: 1,
            message: 'Year information delete successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error delete Year information: ', error);
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
    addYear,
    updateYear,
    deleteYear
};
