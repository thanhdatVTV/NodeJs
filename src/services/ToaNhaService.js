const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;


        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let toaNhasRef = db.collection('tbl_ToaNha');

        // Apply keyword filter if provided
        if (keyword) {
            toaNhasRef = toaNhasRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        toaNhasRef = toaNhasRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await toaNhasRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const toaNhas = [];
        snapshot.forEach((doc) => {
            toaNhas.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: toaNhas,
            totalRecord: toaNhas.length // You might need to adjust this depending on your actual total record count
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

async function addToaNha(req, res) {
    try {
        const {MaTN, TenTN, CoSoId, TenCS} = req.body;

        // Check if MaGV already exists
        const existingLecturer = await db.collection('tbl_ToaNha').where('MaTN', '==', MaTN).get();

        if (!existingLecturer.empty) {
            console.log('in if')
            const resultViewModel = {
                status: 0,
                message: 'MaTN already exists',
                response: null,
                totalRecord: 0
            };
            console.log(resultViewModel);
            return res.status(200).send(resultViewModel);
        }

        const toaNhaData = {
            Status: 1,
            UserUpdated: "",
            TenTN,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateUpdated: new Date(),
            MaTN,
            CoSoId,
            TenCS,
            UserCreated: "",
            IsDelete: false,
            // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_ToaNha').add(toaNhaData);

        const resultViewModel = {
            status: 1,
            message: 'added successfully',
            response: `added with ID: ${docRef.id}`,
            totalRecord: 1
        };

        res.status(201).send(resultViewModel);
    } catch (error) {
        console.error('Error adding: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function updateToaNha(req, res) {
    try {
        const { Id, MaTN, TenTN, CoSoId, TenCS } = req.body;

        const toaNhasRef = db.collection('tbl_ToaNha').doc(Id);

        // Check if the document exists
        const doc = await toaNhasRef.get();
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
        await toaNhasRef.update({
            UserUpdated: '',
            MaTN,
            TenTN,
            CoSoId,
            TenCS,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
            DateUpdated: new Date(),
        });

        const resultViewModel = {
            status: 1,
            message: 'updated successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error updating information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function deleteToaNha(req, res) {
    try {
        const { Id } = req.body;

        const toaNhasRef = db.collection('tbl_ToaNha').doc(Id);

        // Check if the document exists
        const doc = await toaNhasRef.get();
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
        await toaNhasRef.update({
            IsDelete: true,
        });

        const resultViewModel = {
            status: 1,
            message: 'information delete successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error delete information: ', error);
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
    addToaNha,
    updateToaNha,
    deleteToaNha
};
