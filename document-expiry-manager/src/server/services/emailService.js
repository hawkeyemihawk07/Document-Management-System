const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Document Expiry Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
          .warning { color: #e74c3c; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>We received a request to reset your password for your Document Expiry Manager account.</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            <div class="warning">
              <p>⚠️ If you didn't request this, please ignore this email or contact support if you have concerns.</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; 2026 Document Expiry Manager. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendReminderEmail = async (user, documents) => {
  const documentsList = documents
    .map(
      (doc) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${doc.title}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${doc.category}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${new Date(doc.expiryDate).toLocaleDateString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${doc.daysLeft} days</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${doc.cost || 0}</td>
    </tr>
  `,
    )
    .join("");

  const totalCost = documents.reduce((sum, doc) => sum + (doc.cost || 0), 0);

  const mailOptions = {
    from: `"Document Expiry Manager" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "⚠️ Upcoming Document Expiry Reminders",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #667eea; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .total { font-size: 18px; font-weight: bold; color: #667eea; text-align: right; margin-top: 20px; }
          .button { display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Upcoming Expiry Reminders</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name}!</h2>
            <p>You have <strong>${documents.length}</strong> document(s) expiring in the next 30 days.</p>
            
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                ${documentsList}
              </tbody>
            </table>
            
            <div class="total">
              Total Estimated Cost: ₹${totalCost}
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reminder email sent to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendReminderEmail,
};
