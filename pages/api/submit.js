/**
 * A simple method of demonstrating how you can use the Next.js
 * internal API for 'server-less' functions. We export an async function.
 * 
 * We import the nodemailer package to handle SMTP transactional mail.
 * 
 * In a production environment, you could create a .env.production
 * to hold your secure details, e.g.,
 * HOST, AUTH_USER, AUTH_PASS
 * 
 */
import nodemailer from 'nodemailer'

export default async(req, res) => {
  
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  if (req.method === 'POST') {

    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    // We can also extract the form variables from our req.body
    const { 
      email = '', 
      name = '' 
    } = req.body

    res.json({message: 
    `
      Ethereal Mail Message ID: ${info.messageId}
      Email from form: ${email}
      Name from form: ${name}
    `})

  } else {
    res.status(200).json({message: `Response from /api/submit.`})
  }

}