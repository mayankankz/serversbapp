const db = require('../Utill/database');
const teacher = require('../Models/techersModel');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const archiver = require('archiver');
const techersDataModel = require('../Models/techersModel');
const { log } = require('console');

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
