import jwt from 'jsonwebtoken'










export const generateToken =(user)=>{
    return jwt.sign({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      password: user.password
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }

)}


export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };
  
  export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };

  export const isEmployee = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: 'Invalid Admin Token' });
    }
  };


  /* export const mailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth:{
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  }) */