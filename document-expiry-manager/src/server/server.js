const passwordResetRoutes = require("./routes/passwordReset");

const registerServerRoutes = (app) => {
  app.use("/api/password-reset", passwordResetRoutes);
};

module.exports = { registerServerRoutes };
