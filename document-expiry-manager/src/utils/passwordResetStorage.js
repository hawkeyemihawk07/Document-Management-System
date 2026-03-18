const DEMO_USERS_KEY = "demo_users";
const DEMO_PASSWORD_RESETS_KEY = "demo_password_resets";
const RESET_EXPIRY_MS = 60 * 60 * 1000;

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const pruneExpiredResets = (resetRequests) => {
  const now = Date.now();
  return resetRequests.filter(
    (request) => new Date(request.expiresAt).getTime() > now,
  );
};

const getDemoUsers = () => readJson(DEMO_USERS_KEY);

const getResetRequests = () => {
  const resetRequests = pruneExpiredResets(readJson(DEMO_PASSWORD_RESETS_KEY));
  writeJson(DEMO_PASSWORD_RESETS_KEY, resetRequests);
  return resetRequests;
};

const saveResetRequests = (resetRequests) => {
  writeJson(DEMO_PASSWORD_RESETS_KEY, pruneExpiredResets(resetRequests));
};

const createToken = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }

  return `demo-reset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const createDemoPasswordReset = (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getDemoUsers().find(
    (entry) => entry.email.trim().toLowerCase() === normalizedEmail,
  );

  if (!user) {
    return null;
  }

  const token = createToken();
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_MS).toISOString();
  const resetRequests = getResetRequests().filter(
    (request) => request.email.trim().toLowerCase() !== normalizedEmail,
  );

  resetRequests.push({
    token,
    email: user.email,
    expiresAt,
    used: false,
  });

  saveResetRequests(resetRequests);

  return {
    token,
    email: user.email,
    expiresAt,
  };
};

export const verifyDemoPasswordResetToken = (token) => {
  const resetRequest = getResetRequests().find(
    (request) => request.token === token && !request.used,
  );

  if (!resetRequest) {
    return null;
  }

  return {
    email: resetRequest.email,
    expiresAt: resetRequest.expiresAt,
  };
};

export const resetDemoPassword = (token, newPassword) => {
  const resetRequests = getResetRequests();
  const resetRequest = resetRequests.find(
    (request) => request.token === token && !request.used,
  );

  if (!resetRequest) {
    return false;
  }

  const demoUsers = getDemoUsers();
  const userIndex = demoUsers.findIndex(
    (entry) =>
      entry.email.trim().toLowerCase() ===
      resetRequest.email.trim().toLowerCase(),
  );

  if (userIndex === -1) {
    return false;
  }

  demoUsers[userIndex] = {
    ...demoUsers[userIndex],
    password: newPassword,
  };

  writeJson(DEMO_USERS_KEY, demoUsers);
  saveResetRequests(
    resetRequests.map((request) =>
      request.token === token ? { ...request, used: true } : request,
    ),
  );

  return true;
};
