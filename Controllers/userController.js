const { async } = require('q');
const User = require('../Models/userModel');
const db = require('../Utill/database');
let bcrypt = require('bcryptjs');
const { hashPassword } = require('../Utill/hashVerifyPassward');
const school = require('../Models/schoolModel');
const student = require('../Models/studentsData');
const { validationResult, } = require('express-validator');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const { Storage } = require('@google-cloud/storage');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const schoolsModel = require('../Models/schoolModel');
const invoiceModel = require('../Models/invoiceModel');
const userModel = require('../Models/userModel');
const { log, error } = require('console');
const { v4: uuidv4 } = require('uuid');
const classMaster = require('../Models/Classes');
const multer = require('multer');
const XLSX = require('xlsx');
const studentDataModel = require('../Models/studentsData');
const Teachers = require('../Models/techersModel');

const storage = new Storage({
  projectId: 'silken-mile-383309',
  keyFilename: path.join(__dirname, '../silken-mile-383309-49640fd5a454.json'),
});


exports.createUser = async (req, res) => {
  const { username, password, Schoolname, schoolcode, email, validationoptions } = req.body;

  if (!username || !password || !Schoolname || !schoolcode || !email || JSON.parse(validationoptions).length === 0) {
    return res.status(400).json({
      status: 'failed',
      error: 'All fields are required',
    });
  }

  const hashedPass = await hashPassword(password);
  try {
    // Check if user already exists with the same school code and email
    const existingUser = await User.findOne({ where: { schoolcode, email } });
    if (existingUser) {
      return res.status(400).json({
        status: 'failed',
        error: 'User already exists with the same school code and email',
      });
    }
    // Create a new user
    const user = await User.create({ username, password: hashedPass, Schoolname, schoolcode, email, validationoptions, isAdmin: false });
    if (user) {
      const transporter = nodemailer.createTransport({
        // Configure your email provider settings here
        service: 'gmail',
        auth: {
          user: 'mayankgirigoswami2212@gmail.com',
          pass: 'Merikuttu@1',
        },
      });

      const mailOptions = {
        from: 'Mayankgirigoswami2212@gmail.com',
        to: email,
        subject: 'Account Created',
        html: `<!DOCTYPE html> <html> <head> <meta charset="utf-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <title>User Registration</title> <meta name="viewport" content="width=device-width, initial-scale=1"> <style>/* Reset styles */body,h1,h2,h3,p {margin: 0;padding: 0;}/* Container */.container {max-width: 600px;margin: 0 auto;padding: 20px;font-family: Arial, sans-serif;background: #cd2a26;}/* Header */.header {text-align: center;margin-bottom: 20px;}/* Logo */.logo {display: flex;justify-content: center;max-width: 100px;margin-bottom: 20px;background-color: #000000;}/* Title */.title {color: #ffffff;font-size: 28px;margin-bottom: 20px;}/* Content */.content {background-color: #000000;padding: 20px;border-radius: 5px;}/* Username */.username {color: #ffffff;font-size: 24px;margin-bottom: 10px;}/* Credentials */.credentials {margin-bottom: 20px;}.credentials li {list-style: none;margin-bottom: 5px;color: #ffffff;}.credentials strong {font-weight: bold;}/* Contact */.contact {margin-bottom: 20px;}/* Footer */.footer {text-align: center;margin-top: 20px;color: #ffffff;}/* Button */.button {display: inline-block;background-color: #4CAF50;color: #fff;padding: 10px 20px;border-radius: 4px;text-decoration: none;}</style> </head> <body> <div class="container"> <div class="header"> <div class="logo"> <img src="1.png" alt="Logo" style="max-width: 100%; height: auto;"> </div> <h1 class="title">Welcome to Our Platform</h1> </div> <div class="content"> <p class="username">Dear <strong>${username}</strong>,</p> <p style="color: #ffffff;">Thank you for registering with us!</p> <div class="credentials"> <p style="color: #ffffff;">Your account has been created successfully. Here are your login credentials:</p> <ul> <li><strong>Username:</strong> <span style="color: #ffffff;">${username}</span></li> <li><strong>Password:</strong> <span style="color: #ffffff;">${password}</span></li> </ul> </div> <div class="contact"> <p style="color: #ffffff;">If you have any questions or need further assistance, please don't hesitate to contact us.</p> </div> <p style="color: #ffffff;">Best regards,<br />Admin</p> <div class="footer"> <p>&copy; 2023 SB ONLINE SERVICES. All rights reserved.</p> </div> </div> </div> </body> </html>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      return res.status(201).json({
        status: 'success',
        user,
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        error: '',
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 'failed',
      error: error.errors.map((e) => e.message),
    });
  }
};


exports.createSchool = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { schoolname, schoolcode } = req.body;

  try {

    // Check if school code already exists
    const existingSchool = await school.findOne({ where: { schoolcode } });
    if (existingSchool) {
      return res.status(400).json({
        status: 'failed',
        error: 'School code already exists',
      });
    }
    const newSchool = await school.create({ schoolname, schoolcode });
    const message = newSchool
      ? { status: 'success', data: newSchool }
      : { status: 'failed', error: 'Failed to create new school' };
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      error: error.errors?.map((e) => e.message)
    });
  }
}


exports.findUserByID = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json({
        status: 'success',
        user: {
          name: user.username,
          email: user.email,
          school: user.Schoolname,
          code: user.schoolcode
        }
      })
    } else {
      res.status(404).json({
        status: 'error',
        error: 'User not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: 'Somthing Went Wrong'
    })
  }

}


exports.getAllSchools = async (req, res) => {
  try {
    const schools = await school.findAll();
    if (schools) {
      res.status(200).json({
        status: 'success',
        schools
      })
    } else {
      res.status(404).json({
        status: 'error',
        error: 'schools not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: 'Somthing Went Wrong'
    })
  }

}


exports.getStudentsData = async (req, res) => {
  const { classname, schoolname } = req.body;

  if (!classname || !schoolname) res.status(404).json({ error: 'All fields required!!!!' })

  try {
    const students = await student.findAll({
      where: {
        schoolname: schoolname,
        class: classname
      }
    });
    if (students) {
      res.status(200).json({
        status: 'success',
        students
      })
    } else {
      res.status(404).json({
        status: 'error',
        error: 'students not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: 'Somthing Went Wrong'
    })
  }

}

exports.getStudentAllData = async (req, res) => {
  //const {classname,schoolname} = req.body;

  try {
    const students = await student.findAll();
    if (students) {
      res.status(200).json({
        status: 'success',
        students
      })
    } else {
      res.status(404).json({
        status: 'error',
        error: 'students not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: 'Somthing Went Wrong'
    })
  }

}

exports.getStudentDataBySchoolCode = async (req, res) => {
  const { schoolCode } = req.params;


  try {
    const students = await student.findAll({
      where: {
        schoolcode: schoolCode,
      },
    });
    if (students) {
      res.status(200).json({
        status: 'success',
        students
      })
    } else {
      res.status(404).json({
        status: 'error',
        error: 'students not found'
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      error: 'Somthing Went Wrong'
    })
  }

}
// exports.getStudentDataBySchoolCode = async (req, res) => {
//     const { schoolCode } = req.params;

//     try {
//       const studentInfo = await student.findAll({
//         where: {
//             schoolcode: schoolCode,
//         },
//       });
//       if (studentInfo) {
//         res.status(200).json({
//           status: 'success',
//           studentInfo,
//         });
//       } else {
//         res.status(404).json({
//           status: 'error',
//           error: 'students not found',
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         status: 'Error',
//         error: 'Something Went Wrong',
//       });
//     }
//   };


exports.updateStudentData = async (req, res) => {
  const { id } = req.params;
  const bucketName = 'sbonlineservicestest';
  const file = req.file;
  let fileName = "";
  let studentData = req.body;

  try {
    const studentinfo = await student.findByPk(id);
    if (!studentinfo) {
      return res.status(404).json({
        status: 'error',
        error: 'Student not found'
      });
    }

    const oldClass = studentinfo.class;
    const newClass = studentData.class;

    if (file) {
      const schoolFolderName = `${studentData.schoolname}/`;
      const classFolderName = `${schoolFolderName}${newClass}/`;
      fileName = `${studentinfo.studentname}_${newClass}_${uuidv4()}_${studentinfo.session}.jpg`;

      const fileRef = storage.bucket(bucketName).file(`${classFolderName}${fileName}`);

      const fileStream = fileRef.createWriteStream({
        metadata: {
          contentType: 'image/jpeg',
        },
      });

      fileStream.on('error', (err) => {
        console.error(`Failed to upload file: ${err}`);
        return res.status(500).send({ message: 'Failed to upload photo, try again.' });
      });

      fileStream.on('finish', async () => {
        console.log('File uploaded successfully');
        studentData.imgUrl = `${fileName}`;

        await studentinfo.update(studentData);
        res.status(200).json({
          status: 'success',
          message: 'Student data updated successfully',
          updatedData: studentinfo
        });
      });

      fileStream.end(file.buffer);
    } else {
      if (oldClass !== newClass && studentinfo.imgUrl) {
        const oldFilePath = `${studentinfo.schoolname}/${oldClass}/${studentinfo.imgUrl}`;
        const newFilePath = `${studentinfo.schoolname}/${newClass}/${studentinfo.imgUrl}`;

        await storage.bucket(bucketName).file(oldFilePath).move(newFilePath);

        console.log('File moved successfully');
        studentData = {...studentData , session: new Date().getFullYear()}
        
      }

      await studentinfo.update(studentData);
      res.status(200).json({
        status: 'success',
        message: 'Student data updated successfully',
        updatedData: studentinfo
      });
    }
  } catch (error) {
    console.error(`Error updating student data: ${error}`);
    res.status(500).json({
      status: 'error',
      error: 'Something went wrong while updating student data'
    });
  }
};






exports.getSchoolvalidationoptions = async (req, res) => {
  const { schoolCode } = req.params
  try {
    const validationOptions = await User.findOne({
      where: { schoolcode: schoolCode }
    })
    if (validationOptions) {
      res.json({
        status: 'Success',
        data: validationOptions
      })
    } else {
      res.status(404).json({
        status: 'failed',
        message: `failed to find validation options.`
      })
    }

  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: error.message
    })
  }
}


exports.downloadStudentsData = async (req, res) => {
  const { schoolcode, classname } = req.query;
  try {
    const students = await student.findAll({
      where: { schoolcode: schoolcode, class: classname }
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // Define the column headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Student Name', key: 'studentname', width: 20 },
      { header: "Father's Name", key: 'fathersname', width: 20 },
      { header: "Mother's Name", key: 'mothersname', width: 20 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Mobile Number', key: 'mobilenumber', width: 15 },
      { header: 'School Name', key: 'schoolname', width: 20 },
      { header: 'School Code', key: 'schoolcode', width: 15 },
      { header: 'Samagra ID', key: 'samagraid', width: 15 },
      { header: 'Session', key: 'session', width: 10 },
      { header: 'Image URL', key: 'imgUrl', width: 30 },
      { header: 'Student ID No', key: 'studentidno', width: 15 },
      { header: 'Aadhar', key: 'aadhar', width: 15 },
      { header: 'DOB', key: 'dob', width: 15 },
    ];

    // Add data rows to the worksheet
    students.forEach((student) => {
      worksheet.addRow(student.toJSON());
    });

    // Set the response headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="students.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Stream the workbook to the response
    await workbook.xlsx.write(res);

    // End the response
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
}


exports.downloadphotos = async (req, res) => {
  try {
    const bucketName = 'sbonlineservicestest';
    const { schoolname, classname } = req.query;
    const folderPath = `${schoolname}/${classname}/`;

    if (!schoolname || !classname) return res.status(404).json({ message: "not found" });

    // Create a new instance of the Storage client
    const storage = new Storage({
      projectId: 'silken-mile-383309',
      keyFilename: path.join(__dirname, '../silken-mile-383309-49640fd5a454.json'),
    });

    // Create a reference to the bucket
    const bucket = storage.bucket(bucketName);

    // Create a new archive using the archiver library
    const archive = archiver('zip', {
      zlib: { level: 9 } // Set the compression level (optional)
    });

    // Set the response headers for downloading the zip file
    res.setHeader('Content-Disposition', 'attachment; filename="downloaded-files.zip"');
    res.setHeader('Content-Type', 'application/zip');

    // Pipe the response stream to the archive
    archive.pipe(res);

    // List the files in the bucket folder
    const [files] = await bucket.getFiles({ prefix: folderPath });

    // Download each file and add it to the archive
    for (const file of files) {
      const [data] = await file.download();

      // Get the relative path of the file within the folder structure
      const relativePath = file.name.replace(folderPath, '');

      if (relativePath) {
        // Add the file to the archive with its relative path
        archive.append(data, { name: relativePath });
      }
    }

    // Finalize the archive
    await archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};


exports.getAllUsers = async(req, res) => {
  try {
    const Users = await User.findAll();
    res.status(200).json({
      status: 'success',
      data: Users
    })
  } catch (error) {
    res.status(4000).json({
      status: 'failed',
      message: 'Something went wrong'
    })
  }
};

exports.deleteSchool = async (req, res, next) => {
  try {
    const schoolId = req.params.id; // Assuming the school ID is in the URL
   
    // Check if the school with the given ID exists in your database
    const school = await schoolsModel.findByPk(schoolId);
    
    // If the school does not exist, return a 404 Not Found response
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    // Delete the school
    await school.destroy();

    // If the deletion is successful, send a success response
    return res.status(204).json({
      status: 'Success',
      message: 'School deleted successfully'
    }); // 204 means No Content (successful deletion)
  } catch (error) {
    // Handle any errors that may occur during the deletion process
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteInvoice = async (req, res, next) => {
  try {
    const Id = req.params.id; // Assuming the school ID is in the URL
    
    // Check if the school with the given ID exists in your database
    const invoice = await invoiceModel.findByPk(Id);
    
    // If the school does not exist, return a 404 Not Found response
    if (!invoice) {
      return res.status(404).json({ message: 'invoice not found' });
    }

    // Delete the school
    await invoice.destroy();

    // If the deletion is successful, send a success response
    return res.status(204).json({
      status: 'Success',
      message: 'invoice deleted successfully'
    }); // 204 means No Content (successful deletion)
  } catch (error) {
    // Handle any errors that may occur during the deletion process
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const Id = req.params.id; // Assuming the school ID is in the URL
    
    // Check if the school with the given ID exists in your database
    const user = await userModel.findByPk(Id);
    
    // If the school does not exist, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the school
    await user.destroy();

    // If the deletion is successful, send a success response
    return res.status(204).json({
      status: 'Success',
      message: 'User deleted successfully'
    }); // 204 means No Content (successful deletion)
  } catch (error) {
    // Handle any errors that may occur during the deletion process
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.deleteStudent = async (req, res, next) => {
  try {
    const Id = req.params.id;
    
    const student = await studentDataModel.findByPk(Id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();

    return res.status(204).json({
      status: 'Success',
      message: 'Student deleted successfully'
    }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.getSignedUrlsForStudents = async (req, res, next) => {
  const bucketName = 'sbonlineservicestest';
  const {schoolCode,className} = req.params;
  const { session } = req.query;
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3600000, 
  };

  try {
    const sessionValue = session ? session : new Date().getFullYear().toString();
    console.log('Using session value:', sessionValue);

    const students = await student.findAll({
      where: {
        schoolcode: schoolCode,
        class: className.toString(),
        session: sessionValue,
      }
    });

    const colums = await User.findAll({
      where: {schoolcode : schoolCode},
      attributes: ['validationoptions']
    });

    const storage = new Storage({
      projectId: 'silken-mile-383309',
      keyFilename: path.join(__dirname, '../silken-mile-383309-49640fd5a454.json'),
    });

    const studentsWithSignedUrls = await Promise.all(students.map(async (student) => {
      const objectName = `${student.schoolname}/${student.class}/${student.imgUrl}`;
      try {
        const file = storage.bucket(bucketName).file(objectName);
        const [signedUrl] = await file.getSignedUrl(options);
        return {
          ...student.toJSON(),
          img: signedUrl,
        };
      } catch (error) {
        console.error(`Error generating signed URL for ${objectName}:`, error);
        return {
          ...student.toJSON(),
          img: null,
        };
      }
    }));

    return res.status(200).json({
      status: 'success',
      students : studentsWithSignedUrls,
      colums : colums
    })
  } catch (error) {
    console.error('Error retrieving students:', error);
    return res.status(500).json({ error: 'Error retrieving students.' });
  }
};



exports.addClass = async (req,res) => {
  const {classLabel,classValue} = req.body;
  if(!classLabel || !classValue) {
    return res.status(400).json({
      error : 'Classname and ClassValue are required.'
    })
  }
  try {
    const addedClass = await classMaster.create({
      classLabel:classLabel,ClassValue :classValue
    })
    return res.status(201).json({
      status: 'success',
      message : 'Class Added Successfully.',
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message : 'Error while  creating class.',
    })
  }
}




const validHeaders = [
    'studentname',
    'fathersname',
    'mothersname',
    'class',
    'address',
    'mobilenumber',
    'schoolname',
    'schoolcode',
    'samagraid',
    'session',
    'imgUrl',
    'studentidno',
    'aadhar',
    'dob',
    'section',
    'housename',
    'Bloodgroup',
    'other1',
    'other2',
    'other3', 'email', 'empid', 'designation', 'validfrom', 'validTill'
];


  exports.importDataFromXlsx = async (req, res) => {
    try {
      const school  =req.body.school;
      const classValue = req.body.class  
      
      const user = await User.findOne({
        where:{
          schoolcode : school
        }
      })

      if(!user){
        return res.status(404).send({ message: `User not found please register this user.` });
      }

      

      const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const schoolName = user.Schoolname;
        const fileHeaders = rows[0];
        const invalidHeaders = fileHeaders.filter(header => !validHeaders.includes(header));
        const missingHeaders = JSON.parse(JSON.parse(user.validationoptions)).filter((header)=> !fileHeaders.includes(header));
        if (invalidHeaders.length > 0) {
            return res.status(400).send({ message: `Invalid headers: ${invalidHeaders.join(', ')}` });
        }

        if (missingHeaders.length > 0) {
          return res.status(400).send({ message: `Missing headers: ${missingHeaders.join(', ')}` });
      }

        const dataRows = rows.slice(1);
        for (const row of dataRows) {
            const studentData = {};
            validHeaders.forEach((header, index) => {
                if (fileHeaders.includes(header)) {
                    studentData[header] = row[fileHeaders.indexOf(header)];
                }
            });
            studentData.class = classValue;
            studentData.schoolname = schoolName;
            studentData.schoolcode = school;
            if(classValue == 'Teacher'){
              await Teachers.create(studentData)
            }else{
              await studentDataModel.create(studentData);
            }
        }

        res.send({ message: 'File imported successfully' });
    } catch (error) {
        console.error('Error importing file:', error);
        res.status(500).send({ message: 'Error importing file' });
    }
}