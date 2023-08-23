
const { Storage } = require('@google-cloud/storage');
const student = require('../Models/studentsData');
const Multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Invoice = require('../Models/invoiceModel');
const db = require('../Utill/database');

const storage = new Storage({
  projectId: 'silken-mile-383309',
  keyFilename: path.join(__dirname, '../silken-mile-383309-49640fd5a454.json'),
});


// // Configure Multer to handle file uploads
// const upload = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 100 * 1024, // 100KB file size limit
//   },
// });


exports.uploadImageAndSaveData = async (req, res, next) => {

  const bucketName = 'sbonlineservicestest';
  const { schoolName, className, studentName } = req.body;


  const file = req.file;

  // Check if the body exists
  if (!schoolName || !className || !studentName) {
    return res.status(400).send({ message: 'All fields required!!!!' });
  }


  // Check if the file buffer exists
  if (!file || !Buffer.isBuffer(file.buffer)) {
    return res.status(400).send({ message: 'File buffer not found' });
  }



  // Check file size
  const fileSizeInKB = file.buffer.length / 1024;
  if (fileSizeInKB > 100) {
    return res.status(400).send({ message: 'File size should not exceed 100KB' });
  }

  const schoolFolderName = `${schoolName}/`;
  const classFolderName = `${schoolFolderName}${className}/`;
  const fileName = `${schoolName}_${className}_${stu}.jpg`; // You can change this to the desired file name

  try {
    // Check if the school folder exists in the bucket
    const [schoolFolderExists] = await storage.bucket(bucketName).file(schoolFolderName).exists();
    if (!schoolFolderExists) {
      // If school folder does not exist, create it
      await storage.bucket(bucketName).file(schoolFolderName).createWriteStream().end();
      console.log(`School folder created successfully: ${schoolFolderName}`);
    }

    // Check if the class folder exists inside the school folder
    const [classFolderExists] = await storage.bucket(bucketName).file(classFolderName).exists();
    if (!classFolderExists) {
      // If class folder does not exist, create it
      await storage.bucket(bucketName).file(classFolderName).createWriteStream().end();
      console.log(`Class folder created successfully: ${classFolderName}`);
    }

    // Use the storage.bucket(bucketName).file() method to get a reference to the file in GCS
    const fileRef = storage.bucket(bucketName).file(`${classFolderName}${fileName}`);

    // Use the fileRef.createWriteStream() method to create a writable stream for uploading the file buffer
    const fileStream = fileRef.createWriteStream({
      metadata: {
        contentType: 'image/jpeg' // Replace with the actual content type of the file
      }
    });

    fileStream.on('error', (err) => {
      console.error(`Failed to upload file: ${err}`);
      return res.status(500).send({ message: 'Internal server error' });
    });

    fileStream.on('finish', async () => {

      return res.status(500).send({ message: 'Internal server error' });

    });

    fileStream.end(file.buffer); // Write the file buffer to the file stream

  } catch (err) {
    console.error(`Failed to upload file: ${err}`);
    return res.status(500).send({ message: 'Internal server error' });
  }
}



// Define the route handler/controller function
exports.uploadImageAndSaveDataServer = async (req, res, next) => {
  const bucketName = 'sbonlineservicestest';
  const { schoolName, className } = req.body;
  const { studentName, fatherName, motherName, mobileNumber, SamagraID, address, session, schoolcode, dob, aadhar, studentidno, section, housename } = req.body;

  const file = req.file;

  // Check if the file buffer exists
  if (!file || !Buffer.isBuffer(file.buffer)) {
    return res.status(400).send({ message: 'File not found' });
  }

  const schoolFolderName = `${schoolName}/`;
  const classFolderName = `${schoolFolderName}${className}/`;
  const fileName = `${studentName}_${className}_${uuidv4()}_${session}.jpg`; // Use a unique file name for each upload

  try {
    // Check if the school folder exists in the bucket
    const [schoolFolderExists] = await storage.bucket(bucketName).file(schoolFolderName).exists();
    if (!schoolFolderExists) {
      // If school folder does not exist, create it
      await storage.bucket(bucketName).file(schoolFolderName).createWriteStream().end();
      console.log(`School folder created successfully: ${schoolFolderName}`);
    }

    // Check if the class folder exists inside the school folder
    const [classFolderExists] = await storage.bucket(bucketName).file(classFolderName).exists();
    if (!classFolderExists) {
      // If class folder does not exist, create it
      await storage.bucket(bucketName).file(classFolderName).createWriteStream().end();
      console.log(`Class folder created successfully: ${classFolderName}`);
    }

    // Use the storage.bucket(bucketName).file() method to get a reference to the file in GCS
    const fileRef = storage.bucket(bucketName).file(`${classFolderName}${fileName}`);

    // Use the fileRef.createWriteStream() method to create a writable stream for uploading the file buffer
    const fileStream = fileRef.createWriteStream({
      metadata: {
        contentType: 'image/jpeg', // Replace with the actual content type of the file
      },
    });

    fileStream.on('error', (err) => {
      console.error(`Failed to upload file: ${err}`);
      return res.status(500).send({ message: 'Failed to upload photo try again.' });
    });

    fileStream.on('finish', async () => {
      try {


        let studentInfo = {
          studentname: studentName,
          fathersname: fatherName,
          mothersname: motherName,
          class: className,
          address: address,
          mobilenumber: mobileNumber,
          schoolname: schoolName,
          schoolcode: schoolcode,
          samagraid: SamagraID,
          session: session,
          imgUrl: fileName,
          studentidno,
          aadhar,
          dob,
          section,
          housename

        }

        await student.create(studentInfo);

        // Return a success response with the signed URL
        return res.status(201).send({ statud: "Success", message: "Student created successfully." });
      } catch (err) {
        console.error(`Failed to save data to database: ${err}`);
        return res.status(500).send({ message: 'Something Went Wronge.' });
      }
    });

    fileStream.end(file.buffer); // Write the file buffer to the file stream
  } catch (err) {
    console.error(`Failed to upload file: ${err}`);
    return res.status(500).send({ message: 'Internal server error' });
  }
};


// exports.uploadImageAndSaveData = async (req, res, next) => {
//     const storage = new Storage({
//         projectId: 'silken-mile-383309',
//         keyFilename: 'D:/Mayank/ReactProjects/printSB/Server/silken-mile-383309-49640fd5a454.json',
//     });
//     const bucketName = 'sbonlineservicestest';
//     const { schoolName, className } = req.body;
//     const file = req.file;

//     // Check if the file buffer exists
//   if (!file || !Buffer.isBuffer(file.buffer)) {
//     return res.status(400).send({ message: 'File buffer not found' });
//   }

//   const schoolFolderName = `${schoolName}/`;
//   const classFolderName = `${schoolFolderName}${className}/`;
//   const fileName = 'example.jpg'; // You can change this to the desired file name

//   try {
//     // Check if the school folder exists in the bucket
//     const [schoolFolderExists] = await storage.bucket(bucketName).file(schoolFolderName).exists();
//     if (!schoolFolderExists) {
//       // If school folder does not exist, create it
//       await storage.bucket(bucketName).file(schoolFolderName).createWriteStream().end();
//       console.log(`School folder created successfully: ${schoolFolderName}`);
//     }

//     // Check if the class folder exists inside the school folder
//     const [classFolderExists] = await storage.bucket(bucketName).file(classFolderName).exists();
//     if (!classFolderExists) {
//       // If class folder does not exist, create it
//       await storage.bucket(bucketName).file(classFolderName).createWriteStream().end();
//       console.log(`Class folder created successfully: ${classFolderName}`);
//     }

//     // Use the storage.bucket(bucketName).file() method to get a reference to the file in GCS
//     const fileRef = storage.bucket(bucketName).file(`${classFolderName}${fileName}`);

//     // Use the fileRef.createWriteStream() method to create a writable stream for uploading the file buffer
//     const fileStream = fileRef.createWriteStream({
//       metadata: {
//         contentType: 'image/jpeg' // Replace with the actual content type of the file
//       }
//     });

//     fileStream.on('error', (err) => {
//       console.error(`Failed to upload file: ${err}`);
//       return res.status(500).send({ message: 'Internal server error' });
//     });

//     fileStream.on('finish', () => {
//       console.log(`File uploaded successfully to: ${classFolderName}${fileName}`);
//       // Send a success response to the client
//       res.status(200).send({ message: 'File uploaded successfully' });
//     });

//     fileStream.end(file.buffer); // Write the file buffer to the file stream

//   } catch (err) {
//     console.error(`Failed to upload file: ${err}`);
//     return res.status(500).send({ message: 'Internal server error' });
//   }
// }


exports.getSignedUrl = async (req, res, next) => {
  const { id } = req.params;

  let studentInfo = await student.findByPk(id)

  const objectName = `${studentInfo.schoolname}/${studentInfo.class}/${studentInfo.imgUrl}`;
  const bucketName = 'sbonlineservicestest';


  // Generate signed URL
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3600000, // 1H
  };

  try {
    const file = await storage.bucket(bucketName).file(objectName);
    const [signedUrl] = await file.getSignedUrl(options);

    return res.json({ img: signedUrl });
  } catch (error) {
    console.error(`Error generating signed URL for ${objectName}:`, error);
    return res.status(500).json({ error: 'Error generating signed URL.' });
  }
};


exports.saveInvoice = async (req, res) => {
  const { items, taxes, name, address, gst, mobile, issueDate, dueDate, invoiceNumber, discount, gstBill, email, status,total,companyname } = req.body;

  try {
    const newInvoice = {
      invoicenumber: invoiceNumber,
      name,
      companyname,
      address,
      mobile,
      isgstbill: gstBill,
      gstnumber: gst,
      email,
      items,
      issuedate: issueDate,
      duedate: dueDate,
      discount,
      taxes,
      status,
      total
    }
    const invoice = await Invoice.create(newInvoice);
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving the invoice.' });
  }
}


exports.getAllInvoice = async(req,res) => {

  try {
    const invoices = await Invoice.findAll();
    res.status(201).json({status: 'success', message: 'Invoice fetched successfully.', data : invoices });
  } catch (error) {
    res.status(500).json({status: 'failed' , message: 'Invoice not found.'});
  }
}

exports.dashboardData = async(req,res) => {
  try {
    
    const schoolsTotalStudent = await db.executeSelectQuery(`SELECT sc.schoolname as name, COUNT(s.id) AS value
    FROM studentdata s
    INNER JOIN schools sc ON s.schoolcode = sc.schoolcode
    GROUP BY sc.schoolname
    `)

    res.
    status(200).json({
      status: 'success',
      message: 'Schools data fetched successfully.',
      data: schoolsTotalStudent
    })

  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong in fetching.'
    })

  }
}