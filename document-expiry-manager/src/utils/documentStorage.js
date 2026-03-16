const DOCUMENTS_KEY = "demo_documents";

export const getStoredDocuments = () => {
  try {
    return JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveStoredDocuments = (documents) => {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
};

export const normalizeDocumentPayload = (formData) => ({
  ...formData,
  cost: formData.cost === "" ? 0 : Number(formData.cost),
});

export const createStoredDocument = (formData) => {
  const document = {
    ...normalizeDocumentPayload(formData),
    _id: `demo-doc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const documents = getStoredDocuments();
  saveStoredDocuments([document, ...documents]);
  return document;
};

export const removeStoredDocument = (id) => {
  const documents = getStoredDocuments().filter((doc) => doc._id !== id);
  saveStoredDocuments(documents);
  return documents;
};
