import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'fabrizio1007@gmail.com',
    pass: 'fuowyfqtpixsjxjf'
  }
})

transporter.sendMail({
  from: "'CoderBack' <proyecto@coderhouse.com>",
  to: 'fabrizio1007@gmail.com',
  subject: 'Test nodemailer',
  //   text: '',
  html: '<h1>Test nodemailer</h1>',
  attachments: [
    {
      filename: 'logo.png',
      path: './src/public/images/logo.png',
      cid: 'logo'
    }
  ]
})
  .then(info => console.log(info))
  .catch(error => console.log(error))
