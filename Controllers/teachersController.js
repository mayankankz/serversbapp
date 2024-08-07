const db = require('../Utill/database');
const teacher = require('../Models/techersModel');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const archiver = require('archiver');
const techersDataModel = require('../Models/techersModel');
const { log } = require('console');
const userModel = require('../Models/userModel');

exports.GetAllTeachers = async (req, res, next) => {
    const { schoolcode } = req.body;

    if (!schoolcode) res.status(404).json({ error: 'All fields required!!!!' })
  
    try {
      const teachers = await teacher.findAll({
        where: {
            schoolcode: schoolcode,
        }
      });
      if (teachers) {
        res.status(200).json({
          status: 'success',
          teachers
        })
      } else {
        res.status(404).json({
          status: 'error',
          error: 'teachers not found'
        })
      }
    } catch (error) {
      res.status(500).json({
        status: 'Error',
        error: 'Somthing Went Wrong',
      })
    }
}


exports.downloadteachersphotos = async (req, res) => {
    try {
      const bucketName = 'sbonlineservicestest';
      const { schoolname} = req.query;
      
      const folderPath = `${schoolname}/teachers/`;
  
      if (!schoolname) return res.status(404).json({ message: "not found" });
  
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

exports.updateTeacherData = async (req, res) => {
  const { id } = req.params; // Assuming the student ID is passed as a parameter
  console.log(id);
  const updatedData = req.body;
  console.log('====================================');
  console.log(updatedData);
  console.log('====================================');

  try {
    const teacherInfo = await techersDataModel.findByPk(id); // Assuming you have a model called "Student"

    if (teacherInfo) {
      await teacherInfo.update(updatedData);
      res.status(200).json({
        status: 'success',
        message: 'Teachers data updated successfully',
        updatedData: teacherInfo
      });
    } else {
      res.status(404).json({
        status: 'error',
        error: 'Teacher not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Something went wrong while updating Teachers data.'
    });
  }
};

exports.getSignedUrlsForStudents = async (req, res) => {

  const bucketName = 'sbonlineservicestest';
  const {schoolCode} = req.params;
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3600000, 
  };

  try {
    const students = await techersDataModel.findAll({where: {
      schoolcode : schoolCode,
    }});

    const colums = await userModel.findAll({
      where: {schoolcode : schoolCode},
      attributes: ['validationoptions']
    });

    const storage = new Storage({
      projectId: 'silken-mile-383309',
      keyFilename: path.join(__dirname, '../silken-mile-383309-49640fd5a454.json'),
    });

    const studentsWithSignedUrls = await Promise.all(students.map(async (student) => {
      const objectName = `${student.schoolname}/teachers/${student.imgUrl}`;
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


exports.deleteTeacher = async (req, res, next) => {
  try {
    const Id = req.params.id;
    
    const Teacher = await techersDataModel.findByPk(Id);
    
    if (!Teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await Teacher.destroy();

    return res.status(204).json({
      status: 'Success',
      message: 'Teacher deleted successfully'
    }); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
