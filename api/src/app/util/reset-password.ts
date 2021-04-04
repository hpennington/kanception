import fetch = require('node-fetch')
import aws = require('aws-sdk')

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

const resetPassword = async (user_id, email) => {
  console.log({email})
  console.log({user_id})
  const tokenResult = await fetch(
    'https://kanception.auth0.com/oauth/token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      "client_id": "",
      "client_secret": "",
      "audience": "https://kanception.auth0.com/api/v2/",
      "grant_type": "client_credentials"
    })
  })

  const accessToken = await tokenResult.json()
  const token = accessToken.access_token

  const resetPasswordResult =
    await fetch('https://kanception.auth0.com/api/v2/tickets/password-change?email=' + email, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: user_id,
    }),
  })

  console.log('sent reset password email')
  const resetPassword = await resetPasswordResult.json()
  console.log({resetPassword})

  sendPasswordResetEmail(email, resetPassword.ticket)
}

export { sendPasswordResetEmail, resetPassword }