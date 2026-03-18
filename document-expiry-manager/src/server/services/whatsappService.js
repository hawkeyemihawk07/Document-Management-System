const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const sendWhatsAppReminder = async (phoneNumber, documents) => {
  try {
    // Format phone number (add country code if not present)
    let formattedNumber = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedNumber = `+91${phoneNumber}`; // Default to India
    }

    // Create document list for message
    const documentList = documents
      .map(
        (doc) =>
          `• ${doc.title} (${doc.category}) - ${doc.daysLeft} days left - ₹${doc.cost || 0}`,
      )
      .join("\n");

    const totalCost = documents.reduce((sum, doc) => sum + (doc.cost || 0), 0);

    const message = `
🔔 *Document Expiry Reminders*

Hello! You have ${documents.length} document(s) expiring soon:

${documentList}

💰 *Total Estimated Cost:* ₹${totalCost}

Please login to your dashboard to take action:
${process.env.FRONTEND_URL}/dashboard

- Document Expiry Manager
    `;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedNumber}`,
    });

    console.log("WhatsApp message sent:", response.sid);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
};

const sendWhatsAppOTP = async (phoneNumber, otp) => {
  try {
    let formattedNumber = phoneNumber;
    if (!phoneNumber.startsWith("+")) {
      formattedNumber = `+91${phoneNumber}`;
    }

    const message = `
🔐 *Document Expiry Manager - Verification*

Your OTP for WhatsApp verification is: *${otp}*

This OTP will expire in 10 minutes.

If you didn't request this, please ignore.
    `;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedNumber}`,
    });

    console.log("WhatsApp OTP sent:", response.sid);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp OTP:", error);
    throw error;
  }
};

module.exports = {
  sendWhatsAppReminder,
  sendWhatsAppOTP,
};
