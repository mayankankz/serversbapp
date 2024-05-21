const db = require("../Utill/database");
const path = require("path");
const archiver = require("archiver");
const IdCardModel = require("../Models/idcardModel");
const { log } = require("console");

exports.GetAllTemplates = async (req, res, next) => {
  try {
    const templates = await IdCardModel.findAll();
    if (templates) {
      res.status(200).send(
        templates.map((row) => ({
          id: row.id,
          elements: JSON.parse(row.elements),
          backgroundImage: row.backgroundImage,
          layout: row.layout,
        }))
      );
      //   res.status(200).json(
      //     templates.map((row) => {
      //       // Parse the elements field
      //       const parsedElements = JSON.parse(row.elements);
      //       row.elements = parsedElements;
      //       // Return the new object with parsed elements
      //       return {
      //         ...row,
      //       };
      //     })
      //   );
    } else {
      res.status(404).json({
        status: "error",
        error: "templates not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Error",
      error: "Somthing Went Wrong",
    });
  }
};

exports.SaveTemplate = async (req, res) => {
  try {
    let templateInfo = {
      elements: JSON.stringify(req.body.elements),
      layout: req.body.layout,
      backgroundImage: req.body.backgroundImage,
    };

    await IdCardModel.create(templateInfo);
    res.status(200).send("Data saved successfully");
  } catch (e) {
    res.status(500).json({
      status: "Error",
      error: "Somthing Went Wrong",
    });
  }
};
