const aws = require('aws-sdk')

const sendPasswordResetEmail = (recipient, url) => {
  // Replace sender@example.com with your "From" address.
  // This address must be verified with Amazon SES.
  const sender = "Kanception.io <verify@kanception.io>"

  // The subject line for the email.
  const subject = "Kanception.io: Verify account and set password"

  // The email body for recipients with non-HTML email clients.
  const body_text = url

  // The HTML body of the email.
  const body_html = `<html>
  <head></head>
  <body>
    <a href="${url}">Verify account</a>
  </body>
  </html>`;

  // The character encoding for the email.
  const charset = "UTF-8";

  // Create a new SES object.
  var ses = new aws.SES();

  // Specify the parameters to pass to the API.
  var params = {
    Source: sender,
    Destination: {
      ToAddresses: [
        recipient
      ],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: charset
      },
      Body: {
        Text: {
          Data: body_text,
          Charset: charset
        },
        Html: {
          Data: body_html,
          Charset: charset
        }
      }
    },
  }

  //Try to send the email.
  ses.sendEmail(params, function(err, data) {
    // If something goes wrong, print an error message.
    if(err) {
      console.log(err.message);
    } else {
      console.log("Email sent! Message ID: ", data.MessageId);
    }
  });
}

module.exports = { sendPasswordResetEmail }