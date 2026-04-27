import { normalizeDocument, normalizeDocuments } from "./documentRecords";

const DOCUMENTS_KEY = "demo_documents";

const getDocumentSignature = (document) =>
  [
    document.title,
    document.category,
    document.documentNumber,
    document.expiryDate,
  ]
    .map((value) => String(value || "").toLowerCase())
    .join("|");

export const getStoredDocuments = () => {
  try {
    return normalizeDocuments(
      JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || "[]"),
    );
  } catch {
    return [];
  }
};

export const saveStoredDocuments = (documents) => {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(normalizeDocuments(documents)));
};

export const normalizeDocumentPayload = (formData) => ({
  ...formData,
  cost: formData.cost === "" ? 0 : Number(formData.cost),
});

export const createStoredDocument = (formData) => {
  const document = normalizeDocument({
    ...normalizeDocumentPayload(formData),
    _id: `demo-doc-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });

  const documents = getStoredDocuments();
  saveStoredDocuments([document, ...documents]);
  return document;
};

export const upsertStoredDocument = (document) => {
  const normalizedDocument = normalizeDocument(document);
  const currentDocuments = getStoredDocuments();
  const nextDocuments = [
    normalizedDocument,
    ...currentDocuments.filter(
      (storedDocument) =>
        storedDocument._id !== normalizedDocument._id &&
        getDocumentSignature(storedDocument) !==
          getDocumentSignature(normalizedDocument),
    ),
  ];

  saveStoredDocuments(nextDocuments);
  return normalizedDocument;
};

export const mergeStoredDocuments = (documents) => {
  const mergedDocuments = [];
  const seenIds = new Set();
  const seenSignatures = new Set();

  [...normalizeDocuments(documents), ...getStoredDocuments()].forEach(
    (document) => {
      const signature = getDocumentSignature(document);

      if (seenIds.has(document._id) || seenSignatures.has(signature)) {
        return;
      }

      seenIds.add(document._id);
      seenSignatures.add(signature);
      mergedDocuments.push(document);
    },
  );

  return mergedDocuments;
};

export const removeStoredDocument = (id) => {
  const documents = normalizeDocuments(
    getStoredDocuments().filter((doc) => doc._id !== id),
  );
  saveStoredDocuments(documents);
  return documents;
};
