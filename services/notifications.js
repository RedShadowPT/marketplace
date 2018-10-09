
const utils = require('./utlities');

function sendEmail(toAddress, subject, body) {
  utils.postContent(global.config.notifications.mailgunURL + "/messages", {
    auth: {
      user: 'api',
      pass: global.config.notifications.mailgunKey
    },
    form: {
      from: global.config.notifications.emailFrom,
      to: toAddress,
      subject: subject,
      text: body + '\n @: ' + utils.getCurrentTimeDate()
    }
  }).then(response => {
    console.log("Email sent successfully!  Response: " + response);
  }).catch(err => {
    console.error("Did not send e-mail successfully! \n Response: " + JSON.stringify(err));
  });
}

module.exports = {
  sendEmail: sendEmail
}