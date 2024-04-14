const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;


        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let dotDangKysRef = db.collection('tbl_DotDangKy');

        // Apply keyword filter if provided
        if (keyword) {
            dotDangKysRef = dotDangKysRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        dotDangKysRef = dotDangKysRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await dotDangKysRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const dotDangKys = [];
        snapshot.forEach((doc) => {
            dotDangKys.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: dotDangKys,
            totalRecord: dotDangKys.length // You might need to adjust this depending on your actual total record count
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

async function addDotDangKy(req, res) {
    try {
        const {MaDDK, Mota, NamHoc, HocKy, MaMH} = req.body;

        // Check if MaGV already exists
        const existingLecturer = await db.collection('tbl_DotDangKy').where('MaDDK', '==', MaDDK).get();
        if (!existingLecturer.empty) {
            const resultViewModel = {
                status: 0,
                message: 'MaDDK already exists',
                response: null,
                totalRecord: 0
            };
            return res.status(200).send(resultViewModel);
        }

        const DotDangKyData = {
            Status: 1,
            MaDDK,
            Mota,
            NamHoc,
            HocKy,
            MaMH,
            UserUpdated: "",
            DateUpdated: new Date(),
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            UserCreated: "",
            IsDelete: false,
            // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_DotDangKy').add(DotDangKyData);

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

async function updateDotDangKy(req, res) {
    try {
        const { Id, MaDDK, Mota, NamHoc, HocKy, MaMH } = req.body;

        const dotDangKysRef = db.collection('tbl_DotDangKy').doc(Id);

        // Check if the document exists
        const doc = await dotDangKysRef.get();
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
        await dotDangKysRef.update({
            UserUpdated: '',
            MaDDK,
            Mota,
            NamHoc,
            HocKy,
            MaMH,
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

async function deleteDotDangKy(req, res) {
    try {
        const { Id } = req.body;

        const dotDangKysRef = db.collection('tbl_DotDangKy').doc(Id);

        // Check if the document exists
        const doc = await dotDangKysRef.get();
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
        await dotDangKysRef.update({
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
    addDotDangKy,
    updateDotDangKy,
    deleteDotDangKy
};
