const db = require('../Utill/database');
const User = require('../Models/userModel');
const { verifyPassward } = require('../Utill/hashVerifyPassward');

exports.userLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log(username,password);
    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    const user = await User.findOne({ where: { username} });
    if (!user) {
        return res.status(401).json({ Status: "failed", Error: 'Invalid username or password' });
    }

    try {
        const passwordMatch = await verifyPassward(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ Status: "failed", Error: 'Invalid username or password' });
        }

       return  res.status(200).json({ status: 'Success', Massage: 'Login successful',userDetails: {name: user.username, email: user.email, Schoolname: user.Schoolname,schoolcode: user.schoolcode,validationoptions: user.validationoptions,isAdmin: user.isAdmin} });
    } catch (err) {
        res.status(500).send(err);
    }

}