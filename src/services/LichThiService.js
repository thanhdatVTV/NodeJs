const { db } = require('../firebase.js');

async function getList(req, res) {
  try {
    // Parse query parameters
    const { keyword, pageNumber = 1, perPage = 10 } = req.query;

    // Ensure pageNumber and perPage are parsed as integers
    const parsedPageNumber = parseInt(pageNumber);
    const parsedPerPage = parseInt(perPage);

    let lichThisRef = db.collection('tbl_LichThi');

    // Apply keyword filter if provided
    if (keyword) {
      lichThisRef = lichThisRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
    }

    // Add filter condition to exclude documents where isDelete is true
    lichThisRef = lichThisRef.where('IsDelete', '!=', true);

    // Calculate the starting index based on parsedPageNumber and parsedPerPage
    const startIndex = (parsedPageNumber - 1) * parsedPerPage;

    // Fetch a page of documents
    const snapshot = await lichThisRef.limit(parsedPerPage).offset(startIndex).get();

    if (snapshot.empty) {
      const resultViewModel = {
        status: -1,
        message: 'No documents found',
        response: null,
        totalRecord: 0,
      };
      return res.status(404).send(resultViewModel);
    }

    const lichThis = [];
    snapshot.forEach((doc) => {
      lichThis.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    const resultViewModel = {
      status: 1,
      message: 'success',
      response: lichThis,
      totalRecord: lichThis.length, // You might need to adjust this depending on your actual total record count
    };

    res.status(200).send(resultViewModel);
  } catch (error) {
    console.error('Error getting documents: ', error);
    const resultViewModel = {
      status: -1,
      message: 'Internal Server Error',
      response: null,
      totalRecord: 0,
    };
    res.status(500).send(resultViewModel);
  }
}

async function addLichThi(req, res) {
  try {
    const { TenLichThi, PhanCongMonHocId, MaCS, MaTN, MaPhong, MaNhom } = req.body;

    // Check if MaGV already exists
    const existingLecturer = await db
      .collection('tbl_LichThi')
      .where('TenLichThi', '==', TenLichThi)
      .get();
    if (!existingLecturer.empty) {
      const resultViewModel = {
        status: 0,
        message: 'already exists',
        response: null,
        totalRecord: 0,
      };
      return res.status(200).send(resultViewModel);
    }

    const lichThiData = {
      Status: 1,
      TenLichThi,
      // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
      PhanCongMonHocId,
      MaCS,
      MaTN,
      MaPhong,
      MaNhom,
      DateUpdated: new Date(),
      UserUpdated: '',
      UserCreated: '',
      // DateCreated: new Date(DateCreated._seconds * 1000 + DateCreated._nanoseconds / 1e6), // Convert Firestore timestamp to JavaScript Date
      DateCreated: new Date(),
      IsDelete: false,
    };

    const docRef = await db.collection('tbl_LichThi').add(lichThiData);

    const resultViewModel = {
      status: 1,
      message: 'added successfully',
      response: `added with ID: ${docRef.id}`,
      totalRecord: 1,
    };

    res.status(201).send(resultViewModel);
  } catch (error) {
    console.error('Error adding: ', error);
    const resultViewModel = {
      status: -1,
      message: 'Internal Server Error',
      response: null,
      totalRecord: 0,
    };
    res.status(500).send(resultViewModel);
  }
}

async function updateLichThi(req, res) {
  try {
    const { Id, TenLichThi, PhanCongMonHocId, MaCS, MaTN, MaPhong, MaNhom } = req.body;

    const lichThisRef = db.collection('tbl_LichThi').doc(Id);

    // Check if the document exists
    const doc = await lichThisRef.get();
    if (!doc.exists) {
      const resultViewModel = {
        status: 0,
        message: 'Document not found',
        response: null,
        totalRecord: 0,
      };
      return res.status(404).send(resultViewModel);
    }

    // Update the document with the provided data
    await lichThisRef.update({
      TenLichThi,
      PhanCongMonHocId,
      MaCS,
      MaTN,
      MaPhong,
      MaNhom,
      // DateUpdated: new Date(DateUpdated._seconds * 1000 + DateUpdated._nanoseconds / 1e6),
      UserUpdated: '',
      DateUpdated: new Date(),
    });

    const resultViewModel = {
      status: 1,
      message: 'updated successfully',
      response: null,
      totalRecord: 0,
    };

    res.status(200).send(resultViewModel);
  } catch (error) {
    console.error('Error updating information: ', error);
    const resultViewModel = {
      status: -1,
      message: 'Internal Server Error',
      response: null,
      totalRecord: 0,
    };
    res.status(500).send(resultViewModel);
  }
}

async function deleteLichThi(req, res) {
  try {
    const { Id } = req.body;

    const lichThisRef = db.collection('tbl_LichThi').doc(Id);

    // Check if the document exists
    const doc = await lichThisRef.get();
    if (!doc.exists) {
      const resultViewModel = {
        status: 0,
        message: 'Document not found',
        response: null,
        totalRecord: 0,
      };
      return res.status(404).send(resultViewModel);
    }

    // Update the document with the provided data
    await lichThisRef.update({
      IsDelete: true,
    });

    const resultViewModel = {
      status: 1,
      message: 'information delete successfully',
      response: null,
      totalRecord: 0,
    };

    res.status(200).send(resultViewModel);
  } catch (error) {
    console.error('Error delete information: ', error);
    const resultViewModel = {
      status: -1,
      message: 'Internal Server Error',
      response: null,
      totalRecord: 0,
    };
    res.status(500).send(resultViewModel);
  }
}

module.exports = {
  getList,
  addLichThi,
  updateLichThi,
  deleteLichThi,
};
