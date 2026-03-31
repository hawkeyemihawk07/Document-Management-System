const getTextValue = (value, fallback = "") => {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue || fallback;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue || fallback;
};

const getNumberValue = (value, fallback = 0) => {
  const normalizedValue = Number(value);
  return Number.isFinite(normalizedValue) ? normalizedValue : fallback;
};

const getIsoDateValue = (value, fallback = "") => {
  if (!value) {
    return fallback;
  }

  const normalizedDate = new Date(value);
  return Number.isNaN(normalizedDate.getTime())
    ? fallback
    : normalizedDate.toISOString();
};

export const getDocumentExpiryDate = (document) => {
  if (!document?.expiryDate) {
    return null;
  }

  const normalizedDate = new Date(document.expiryDate);
  return Number.isNaN(normalizedDate.getTime()) ? null : normalizedDate;
};

export const getDocumentCategoryLabel = (category) =>
  getTextValue(category, "other").replace(/_/g, " ");

export const getSearchableDocumentValue = (value) =>
  getTextValue(value).toLowerCase();

export const normalizeDocument = (document, index = 0) => ({
  ...document,
  _id: getTextValue(document?._id ?? document?.id, `document-${index}`),
  title: getTextValue(document?.title, "Untitled document"),
  category: getTextValue(document?.category, "other")
    .toLowerCase()
    .replace(/\s+/g, "_"),
  documentNumber: getTextValue(document?.documentNumber),
  issuingAuthority: getTextValue(
    document?.issuingAuthority ?? document?.issuer,
  ),
  issueDate: getIsoDateValue(document?.issueDate),
  expiryDate: getIsoDateValue(document?.expiryDate),
  cost: getNumberValue(document?.cost),
  notes: getTextValue(document?.notes),
  createdAt: getIsoDateValue(document?.createdAt, new Date().toISOString()),
});

export const normalizeDocuments = (documents) =>
  Array.isArray(documents)
    ? documents.map((document, index) => normalizeDocument(document, index))
    : [];
