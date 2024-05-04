const { db } = require('../firebase.js');

async function getList(req, res) {
    try {
        // Parse query parameters
        const { keyword, MaDDK, MaSV, pageNumber = 1, perPage = 10 } = req.query;
        console.log(keyword, MaDDK, MaSV, pageNumber, perPage)
        // Ensure pageNumber and perPage are parsed as integers
        const parsedPageNumber = parseInt(pageNumber);
        const parsedPerPage = parseInt(perPage);

        let dangKyMonHocsRef = db.collection('tbl_DangKyMonHoc');

        // Apply keyword filter if provided
        if (keyword != "") {
            dangKyMonHocsRef = dangKyMonHocsRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
        }
        if (MaDDK) {
            dangKyMonHocsRef = dangKyMonHocsRef.where('MaDDK', '==', MaDDK);
        }
        if (MaSV) {
            dangKyMonHocsRef = dangKyMonHocsRef.where('MaSV', '==', MaSV);
        }
        // Add filter condition to exclude documents where isDelete is true
        dangKyMonHocsRef = dangKyMonHocsRef.where('IsDelete', '!=', true);


        // Calculate the starting index based on parsedPageNumber and parsedPerPage
        const startIndex = (parsedPageNumber - 1) * parsedPerPage;

        // Fetch a page of documents
        const snapshot = await dangKyMonHocsRef.limit(parsedPerPage).offset(startIndex).get();

        if (snapshot.empty) {
            const resultViewModel = {
                status: -1,
                message: 'No documents found',
                response: null,
                totalRecord: 0
            };
            return res.status(404).send(resultViewModel);
        }

        const dangKyMonHocs = [];
        snapshot.forEach((doc) => {
            dangKyMonHocs.push({
                id: doc.id,
                data: doc.data(),
            });
        });

        const resultViewModel = {
            status: 1,
            message: 'success',
            response: dangKyMonHocs,
            totalRecord: dangKyMonHocs.length // You might need to adjust this depending on your actual total record count
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

async function addDangKyMonHoc(req, res) {
    try {
        const { MaSV, MaDDK, NganhHoc, MaMH, TenMH, NamHoc, HocKy, NhomLop, CoSo, ToaNha, Phong, TuanHoc, Thu, TietHoc, SiSo, TeacherCode } = req.body;
        console.log(MaSV, MaDDK, NganhHoc, MaMH, TenMH, NamHoc, HocKy, NhomLop, CoSo, ToaNha, Phong, TuanHoc, Thu, TietHoc, SiSo, TeacherCode);
        // Check if MaMH already exists
        const existingMH = await db.collection('tbl_DangKyMonHoc')
            .where('MaDDK', '==', MaDDK)
            .where('MaSV', '==', MaSV) // Thêm điều kiện MaSV = MaSV
            .where('MaMH', '==', MaMH)
            .where('IsDelete', '!=', true)
            .get();
        if (!existingMH.empty) {
            const resultViewModel = {
                status: 0,
                message: 'Môn học này đã được đăng ký rồi',
                response: null,
                totalRecord: 0
            };
            return res.status(200).send(resultViewModel);
        }

        const DotDangKyData = {
            Status: 1,
            MaSV,
            MaDDK,
            NganhHoc,
            MaMH,
            TenMH,
            NamHoc,
            HocKy,
            NhomLop,
            CoSo,
            ToaNha,
            Phong,
            TuanHoc,
            Thu,
            TietHoc,
            SiSo,
            TeacherCode,
            UserUpdated: "",
            DateUpdated: new Date(),
            UserCreated: "",
            IsDelete: false,
            DateCreated: new Date()
        };

        const docRef = await db.collection('tbl_DangKyMonHoc').add(DotDangKyData);

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

async function updateDangKyMonHoc(req, res) {
    try {
        const { Id, MaSV, MaDDK, NganhHoc, MaMH, TenMH, NamHoc, HocKy, NhomLop, CoSo, ToaNha, Phong, TuanHoc, Thu, TietHoc, SiSo, TeacherCode } = req.body;

        const dangKyMonHocsRef = db.collection('tbl_DangKyMonHoc').doc(Id);

        // Check if the document exists
        const doc = await dangKyMonHocsRef.get();
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
        await dangKyMonHocsRef.update({
            UserUpdated: '',
            MaSV,
            MaDDK,
            NganhHoc,
            MaMH,
            TenMH,
            NamHoc,
            HocKy,
            NhomLop,
            CoSo,
            ToaNha,
            Phong,
            TuanHoc,
            Thu,
            TietHoc,
            SiSo,
            TeacherCode,
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

async function deleteDangKyMonHoc(req, res) {
    try {
        const { Id } = req.body;

        const dangKyMonHocsRef = db.collection('tbl_DangKyMonHoc').doc(Id);

        // Check if the document exists
        const doc = await dangKyMonHocsRef.get();
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
        await dangKyMonHocsRef.update({
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
    addDangKyMonHoc,
    updateDangKyMonHoc,
    deleteDangKyMonHoc
};
