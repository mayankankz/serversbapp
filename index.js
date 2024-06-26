const express = require("express");
const userRouter = require("./Routes/userRoutes");
const sequelize = require("./Utill/connection");
const userModel = require("./Models/userModel");
const invoiceModel = require("./Models/invoiceModel");
const authRouter = require("./Routes/authRoutes");
const studentDataModel = require("./Models/studentsData");
const schoolsModel = require("./Models/schoolModel");
const appRouter = require("./Routes/appRoutes");
const cors = require("cors");
const techersDataModel = require("./Models/techersModel");
const teachersRouter = require("./Routes/techersRoutes");
const app = express();
const PORT = 5000;
var bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs")
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    massage: "success",
  });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use('/images', express.static(path.join(__dirname, 'public/assets')));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ filePath: `http://localhost:${PORT}/images/${req.file.filename}` });
});

app.get('/api/images', (req, res) => {
  const imageDir = path.join(__dirname, 'public/assets');
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve images' });
    }
    const imagePaths = files.map(file => `http://localhost:${PORT}/images/${file}`);
    res.json(imagePaths);
  });
});
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/app", appRouter);
app.use("/teacher", teachersRouter);

app.use((req, res, next) => {
  res.status(404).send("404: Page not found");
});

app.use(userModel);
app.use(studentDataModel);
app.use(schoolsModel);
app.use(invoiceModel);
app.use(techersDataModel);

sequelize
  .sync()
  .then((result) => {
    console.log("tables created");
    app.listen(process.env.PORT || PORT);
  })
  .catch((err) => {
    console.log(err);
  });
