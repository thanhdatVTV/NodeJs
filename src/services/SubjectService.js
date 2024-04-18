// SubjectServices.js

const { db } = require('../firebase.js');

async function getList(req, res) {
  try {
    // Parse query parameters
    const { keyword, pageNumber = 1, perPage = 10 } = req.query;

    // Ensure pageNumber and perPage are parsed as integers
    const parsedPageNumber = parseInt(pageNumber);
    const parsedPerPage = parseInt(perPage);

    let subjectsRef = db.collection('tbl_MonHoc');

    // Apply keyword filter if provided
    if (keyword) {
      subjectsRef = subjectsRef.where('fieldName', '==', keyword); // Replace "fieldName" with the actual field name
    }

    // Add filter condition to exclude documents where isDelete is true
    subjectsRef = subjectsRef.where('IsDelete', '!=', true);

    // Calculate the starting index based on parsedPageNumber and parsedPerPage
    const startIndex = (parsedPageNumber - 1) * parsedPerPage;

    // Fetch a page of documents
    const snapshot = await subjectsRef.limit(parsedPerPage).offset(startIndex).get();

    if (snapshot.empty) {
      const resultViewModel = {
        status: -1,
        message: 'No documents found',
        response: null,
        totalRecord: 0,
      };
      return res.status(404).send(resultViewModel);
    }

    const subjects = [];
    snapshot.forEach((doc) => {
      subjects.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    const resultViewModel = {
      status: 1,
      message: 'success',
      response: subjects,
      totalRecord: subjects.length, // You might need to adjust this depending on your actual total record count
    };

    res.status(200).send(subjects);
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

async function addSubject(req, res) {
  try {
    const { MaMonHoc, TenMonHoc } = req.body;

    const existingSubject = await db
      .collection('tbl_MonHoc')
      .where('MaMonHoc', '==', MaMonHoc)
      .get();
    if (!existingSubject.empty) {
      const resultViewModel = {
        status: 0,
        message: 'MaMonHoc already exists',
        response: null,
        totalRecord: 0,
      };
      return res.status(200).send(resultViewModel);
    }

    const subjectData = {
      MaMonHoc,
      TenMonHoc,
      Status: 1,
      IsDelete: false,
      UserCreated: '',
      DateCreated: new Date(),
      UserUpdated: '',
      DateUpdated: new Date(),
    };

    const docRef = await db.collection('tbl_MonHoc').add(subjectData);

    const resultViewModel = {
      status: 1,
      message: 'Thêm mới thành công',
      response: `Subject added with ID: ${docRef.id}`,
      totalRecord: 1,
    };

    res.status(201).send(resultViewModel);
  } catch (error) {
    console.error('Error adding subject: ', error);
    const resultViewModel = {
      status: -1,
      message: 'Internal Server Error',
      response: null,
      totalRecord: 0,
    };
    res.status(500).send(resultViewModel);
  }
}

async function updateSubject(req, res) {
  try {
    const { Id, MaMonHoc, TenMonHoc } = req.body;

    // Validate required parameters
    // if (!Id || !UserUpdated || !TenGV || !DateUpdated || !MaGV) {
    //     return res.status(400).send("Missing required parameters");
    // }

    const subjectRef = db.collection('tbl_MonHoc').doc(Id);

    // Check if the document exists
    const doc = await subjectRef.get();
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
    await subjectRef.update({
      MaMonHoc,
      TenMonHoc,
      UserUpdated: '',
      DateUpdated: new Date(),
    });

    const resultViewModel = {
      status: 1,
      message: 'Subject information updated successfully',
      response: null,
      totalRecord: 0,
    };

    res.status(200).send(resultViewModel);
  } catch (error) {
    console.error('Error updating subject information: ', error);
    const resultViewModel = {
      status: -1,
      message: 'Internal Server Error',
      response: null,
      totalRecord: 0,
    };
    res.status(500).send(resultViewModel);
  }
}

async function deleteSubject(req, res) {
  try {
    const { Id } = req.body;

    const subjectRef = db.collection('tbl_MonHoc').doc(Id);

    // Check if the document exists
    const doc = await subjectRef.get();
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
    await subjectRef.update({
      IsDelete: true,
    });

    const resultViewModel = {
      status: 1,
      message: 'Subject information delete successfully',
      response: null,
      totalRecord: 0,
    };

    res.status(200).send(resultViewModel);
  } catch (error) {
    console.error('Error delete subject information: ', error);
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
  addSubject,
  updateSubject,
  deleteSubject,
};
