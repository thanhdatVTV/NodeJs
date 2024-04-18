// NganhHocServices.js

const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, pageNumber = 1, perPage = 10 } = req.query;


        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let EduProgramRef = db.collection('tbl_ChuongTrinhDaoTao');

        // Apply keyword filter if provided
        if (keyword) {
            EduProgramRef = EduProgramRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }

        // Add filter condition to exclude documents where isDelete is true
        EduProgramRef = EduProgramRef.where('IsDelete', '!=', true);

        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await EduProgramRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const EduProgram = [];
        snapshot.forEach((doc) => {
            EduProgram.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: EduProgram,
            totalRecord: EduProgram.length // You might need to adjust this depending on your actual total record count
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

async function addEduProgram(req, res) {
    try {
        const { NganhId, TenNganh, MaMonHoc, TenMonHoc, GroupId, IsCompulsory} =
            req.body;

        // Check if MaGV or TenGV is undefined
        if (!NganhId || !TenNganh || !MaMonHoc || !TenMonHoc || !GroupId) {
            return res.status(400).send({
                status: 0,
                message: 'Some Info is missing',
                response: null,
                totalRecord: 0
            });
        }

        

        const EduProgramData = {
            NganhId, 
            TenNganh, 
            MaMonHoc, 
            TenMonHoc, 
            GroupId, 
            IsCompulsory,
            UserUpdated: "",
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateUpdated: new Date(),
            UserCreated: "",
            IsDelete: false,
            // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_ChuongTrinhDaoTao').add(EduProgramData);

        const resultViewModel = {
            status: 1,
            message: 'Thêm mới thành công',
            response: `EducationProgram added with ID: ${docRef.id}`,
            totalRecord: 1
        };

        res.status(201).send(resultViewModel);
    } catch (error) {
        console.error('Error adding EducationProgram: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function updateEduProgram(req, res) {
    try {
        const { Id, NganhId, TenNganh, MaMonHoc, TenMonHoc, GroupId, IsCompulsory } = req.body;

        // Validate required parameters if needed
        // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
        //     return res.status(400).send("Missing required parameters");
        // }

        const EduProgramRef = db.collection('tbl_ChuongTrinhDaoTao').doc(Id);

        // Check if the document exists
        const doc = await EduProgramRef.get();
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
        await EduProgramRef.update({
            UserUpdated: '',
            NganhId, 
            TenNganh, 
            MaMonHoc, 
            TenMonHoc, 
            GroupId, 
            IsCompulsory,
            // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
            DateUpdated: new Date(),
        });

        const resultViewModel = {
            status: 1,
            message: 'EducationProgram information updated successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error updating EducationProgram information: ', error);
        const resultViewModel = {
            status: -1,
            message: 'Internal Server Error',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

async function deleteEduProgram(req, res) {
    try {
        const { Id } = req.body;

        const EduProgramRef = db.collection('tbl_ChuongTrinhDaoTao').doc(Id);

        // Check if the document exists
        const doc = await EduProgramRef.get();
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
        await EduProgramRef.update({
            IsDelete: true,
        });

        const resultViewModel = {
            status: 1,
            message: 'EducationProgram information delete successfully',
            response: null,
            totalRecord: 0
        };

        res.status(200).send(resultViewModel);
    } catch (error) {
        console.error('Error delete EducationProgram information: ', error);
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
    addEduProgram,
    updateEduProgram,
    deleteEduProgram
};
