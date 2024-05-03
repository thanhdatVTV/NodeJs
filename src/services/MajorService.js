// NganhHocServices.js

const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;


        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let MajorRef = db.collection('tbl_NganhHoc');

        // Apply keyword filter if provided
        if (keyword) {
            MajorRef = MajorRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        MajorRef = MajorRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await MajorRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const Major = [];
        snapshot.forEach((doc) => {
            Major.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: Major,
            totalRecord: Major.length // You might need to adjust this depending on your actual total record count
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

async function addMajor(req, res) {
    try {
        const {MaKhoa, TenKhoa, MaNganh, TenNganh} =
            req.body;

        // Check if MaGV or TenGV is undefined
        if (!MaNganh || !TenNganh || !MaKhoa || !TenKhoa) {
            return res.status(400).send({
                status: 0,
                message: 'Nganh or Khoa is missing',
                response: null,
                totalRecord: 0
            });
        }

        // Check if MaGV already exists
        const existingMajor = await db.collection('tbl_NganhHoc').where('MaNganh', '==', MaNganh).get();
        if (!existingMajor.empty) {
            const resultViewModel = {
                status: 0,
                message: 'MaNganh already exists',
                response: null,
                totalRecord: 0
            };
            return res.status(200).send(resultViewModel);
        }

        const MajorData = {
            Status: 1,
            UserUpdated: "",
            MaKhoa,
            TenKhoa,
            TenNganh,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateUpdated: new Date(),
            MaNganh,
            UserCreated: "",
            IsDelete: false,
            // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_NganhHoc').add(MajorData);

        const resultViewModel = {
            status: 1,
            message: 'Thêm mới thành công',
            response: `Major added with ID: ${docRef.id}`,
            totalRecord: 1
        };

        res.status(201).send(resultViewModel);
    } catch (error) {
        console.error('Error adding Major: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function updateMajor(req, res) {
    try {
        const { Id, MaKhoa, TenKhoa, TenNganh, MaNganh } = req.body;

        // Validate required parameters if needed
        // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
        //     return res.status(400).send("Missing required parameters");
        // }

        const MajorRef = db.collection('tbl_NganhHoc').doc(Id);

        // Check if the document exists
        const doc = await MajorRef.get();
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
        await MajorRef.update({
            UserUpdated: '',
            MaKhoa,
            TenKhoa,
            TenNganh,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
            DateUpdated: new Date(),
            MaNganh,
        });

        const resultViewModel = {
            status: 1,
            message: 'Major information updated successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error updating Major information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function deleteMajor(req, res) {
    try {
        const { Id } = req.body;

        const MajorRef = db.collection('tbl_NganhHoc').doc(Id);

        // Check if the document exists
        const doc = await MajorRef.get();
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
        await MajorRef.update({
            IsDelete: true,
        });

        const resultViewModel = {
            status: 1,
            message: 'Major information delete successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error delete Major information: ', error);
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
    addMajor,
    updateMajor,
    deleteMajor
};
