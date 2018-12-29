var nodemailer = require('nodemailer');
module.exports={
    sendmail:function(receiver,password){
var transport = {
  host: 'smtp.gmail.com',
  auth: {
    user: '',
    pass: ''
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready  to take messages');
  }
});


var mail = {
    from: "",
    to: receiver, 
    subject: 'Community Builder',
    text: "Your password is "+password
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        msg: 'fail'
      })
    } else {
      res.json({
        msg: 'success'
      })
    }
  })
    }

}
