const axios = require('axios');
const admin = require('firebase-admin');
const { db } = require('../firebase.js');

async function login(req, res) {
    try {

        const { UserName, PassWord } = req.body;
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu hay không
        const userSnapshot = await db.collection('tbl_User').where('UserName', '==', UserName).get();

        if (!userSnapshot.empty) {
            // Nếu người dùng đã tồn tại, trả về thông tin người dùng và thông báo đăng nhập thành công
            const userData = userSnapshot.docs[0].data();
            const userInfoViewModel = { ...userData, Type: userData.Type };

            const resultViewModel = {
                status: 1,
                message: 'Đăng nhập thành công',
                response: userInfoViewModel,
                totalRecord: 1
            };

            return res.status(200).send(resultViewModel);
        } else {
            // Tạo URL endpoint để gửi yêu cầu kiểm tra người dùng
            const apiUrl = `http://localhost:5000/api/user/checkuser?UserName=${UserName}&PassWord=${PassWord}`;

            // Gửi yêu cầu GET đến API kiểm tra người dùng
            const response = await axios.get(apiUrl);
            console.log('datnguyen2233167', response);
            if (response.status === 200) {
                const userData = response.data;

                if (userData.status === 1) {
                    // Nếu đăng nhập thành công, thêm thông tin người dùng vào cơ sở dữ liệu Firebase
                    const userResponse = userData.response;
                    const userCollection = db.collection('tbl_User');

                    // Thêm thông tin người dùng vào collection tbl_User
                    const userDocRef = await userCollection.add({
                        UserName: UserName,
                        PassWord: PassWord,
                        Type: userResponse.Type,
                        IsDelete: false
                    });

                    let userInfoViewModel = null;
                    if (userResponse.Type === 0) {
                        // Nếu người dùng là sinh viên, thêm thông tin sinh viên vào collection tbl_Student
                        const studentCollection = db.collection('tbl_Student');
                        await studentCollection.add({
                            DateOfBirth: userResponse.DateOfBirth,
                            FirstName: userResponse.FirstName,
                            FullName: userResponse.FullName,
                            IsDelete: false,
                            LastName: userResponse.LastName,
                            MajorId: userResponse.MajorId,
                            StudentId: userResponse.StudentId,
                            UserId: userDocRef.id
                        });
                        userInfoViewModel = { ...userResponse, Type: 0 }; // Thông tin sinh viên
                    } else if (userResponse.Type === 1) {
                        // Nếu người dùng là giáo viên, thêm thông tin giáo viên vào collection tbl_Teacher
                        const teacherCollection = db.collection('tbl_Teacher');
                        await teacherCollection.add({
                            DateOfBirth: userResponse.DateOfBirth,
                            FirstName: userResponse.FirstName,
                            FullName: userResponse.FullName,
                            IsDelete: false,
                            LastName: userResponse.LastName,
                            TeacherId: userResponse.TeacherId,
                            UserId: userDocRef.id
                        });
                        userInfoViewModel = { ...userResponse, Type: 1 }; // Thông tin giáo viên
                    }

                    // Tạo resultViewModel
                    const resultViewModel = {
                        status: 1,
                        message: 'Đăng nhập thành công',
                        response: userInfoViewModel,
                        totalRecord: 1
                    };

                    res.status(200).send(resultViewModel);
                } else {
                    // Trường hợp đăng nhập thất bại
                    const resultViewModel = {
                        status: 0,
                        message: 'Đăng nhập thất bại',
                        response: null,
                        totalRecord: 0
                    };
                    res.status(500).send(resultViewModel);
                }
            } else {
                throw new Error(`Error: ${response.status}`);
            }
        }




    } catch (error) {
        console.error('Error during login:', error);
        // Trường hợp có lỗi nội bộ
        const resultViewModel = {
            status: -1,
            message: 'Lỗi nội bộ',
            response: null,
            totalRecord: 0
        };
        res.status(500).send(resultViewModel);
    }
}

module.exports = { login };
