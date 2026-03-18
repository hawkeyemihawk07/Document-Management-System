const cron = require("node-cron");
const Document = require("../../models/Document");
const { sendReminderEmail } = require("./emailService");
const { sendWhatsAppReminder } = require("./whatsappService");
const { differenceInDays } = require("date-fns");

// Run every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running reminder checks...");

  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Find all documents expiring in the next 30 days
    const expiringDocs = await Document.find({
      expiryDate: {
        $gte: today,
        $lte: thirtyDaysFromNow,
      },
      status: "active",
    }).populate("userId");

    // Group documents by user
    const userDocs = {};
    expiringDocs.forEach((doc) => {
      const userId = doc.userId._id.toString();
      if (!userDocs[userId]) {
        userDocs[userId] = {
          user: doc.userId,
          documents: [],
        };
      }

      const daysLeft = differenceInDays(new Date(doc.expiryDate), today);
      userDocs[userId].documents.push({
        ...doc.toObject(),
        daysLeft,
      });
    });

    // Send reminders to each user
    for (const userId in userDocs) {
      const { user, documents } = userDocs[userId];

      // Send email reminders
      if (user.emailNotifications) {
        await sendReminderEmail(user, documents);
      }

      // Send WhatsApp reminders
      if (user.whatsappOptIn && user.phoneNumber) {
        await sendWhatsAppReminder(user.phoneNumber, documents);
      }
    }

    console.log(`Reminders sent to ${Object.keys(userDocs).length} users`);
  } catch (error) {
    console.error("Error in reminder service:", error);
  }
});

// Run every hour for critical reminders (7 days or less)
cron.schedule("0 * * * *", async () => {
  console.log("Running critical reminder checks...");

  try {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    await Document.find({
      expiryDate: {
        $gte: today,
        $lte: sevenDaysFromNow,
      },
      status: "active",
    }).populate("userId");

    // Send more urgent reminders for critical documents
    // (similar logic as above but with more urgent messaging)
  } catch (error) {
    console.error("Error in critical reminder service:", error);
  }
});
