const express = require('express');
const userRouter = require("./Routes/userRoutes");
const sequelize = require("./Utill/connection");
const userModel =  require("./Models/userModel");
const invoiceModel = require("./Models/invoiceModel")
const authRouter = require('./Routes/authRoutes');
const studentDataModel = require('./Models/studentsData');
const schoolsModel = require('./Models/schoolModel');
const appRouter = require('./Routes/appRoutes');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/',(req,res) => {
  res.json({
      massage : 'success'
  });    
})




app.use('/user' , userRouter )
app.use('/auth' , authRouter)
app.use('/app' , appRouter)

app.use((req, res, next) => {
  res.status(404).send('404: Page not found');
});

app.use(userModel)
app.use(studentDataModel);
app.use(schoolsModel);
app.use(invoiceModel)

sequelize.sync()
  .then(result => {
    console.log("tables created")
    app.listen(process.env.PORT || PORT);
  })
  .catch(err => {
    console.log(err)
  })