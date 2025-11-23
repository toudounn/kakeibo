// src/db/indexedDB.ts

// データベースを開く（なければ作成）
// export async function openDB() {
//   return new Promise<IDBDatabase>((resolve, reject) => {
//     const request = indexedDB.open("KakeiboDB", 1);

//     request.onupgradeneeded = (event) => {
//       const db = (event.target as IDBOpenDBRequest).result;
//       if (!db.objectStoreNames.contains("expenses")) {
//         db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
//       }
//     };

//     request.onsuccess = () => resolve(request.result);
//     request.onerror = () => reject(request.error);
//   });
// }
export async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    // バージョン番号を上げると onupgradeneeded が呼ばれる
    const request = indexedDB.open("KakeiboDB", 2);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 家計簿データ
      if (!db.objectStoreNames.contains("expenses")) {
        db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
      }

      // カード種類
      if (!db.objectStoreNames.contains("cardTypes")) {
        db.createObjectStore("cardTypes", { keyPath: "id" });
      }

      // ポイント種類
      if (!db.objectStoreNames.contains("pointTypes")) {
        db.createObjectStore("pointTypes", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


// データ追加
export async function addExpense(expense: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("expenses", "readwrite");
    const store = tx.objectStore("expenses");
    store.add(expense);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// データ取得
export async function getExpenses() {
  const db = await openDB();
  return new Promise<any[]>((resolve, reject) => {
    const tx = db.transaction("expenses", "readonly");
    const store = tx.objectStore("expenses");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// データ削除
export async function deleteExpense(id: number) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("expenses", "readwrite");
    const store = tx.objectStore("expenses");
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// データ更新（編集）
export async function updateExpense(expense: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("expenses", "readwrite");
    const store = tx.objectStore("expenses");
    store.put(expense); // put は「追加 or 更新」
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// カード種類保存
export async function saveCardTypes(types: string[]) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("cardTypes", "readwrite");
    const store = tx.objectStore("cardTypes");
    store.put({ id: "cardTypes", value: types });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// カード種類取得
export async function getCardTypes() {
  const db = await openDB();
  return new Promise<string[]>((resolve, reject) => {
    const tx = db.transaction("cardTypes", "readonly");
    const store = tx.objectStore("cardTypes");
    const request = store.get("cardTypes");
    request.onsuccess = () => resolve(request.result?.value || []);
    request.onerror = () => reject(request.error);
  });
}

// カード種類削除
export async function deleteCardType(type: string) {
  const current = await getCardTypes();
  const updated = current.filter((t) => t !== type);
  await saveCardTypes(updated);
  return updated; // ← 更新後の配列を返す
}

// ポイント種類保存
export async function savePointTypes(types: string[]) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("pointTypes", "readwrite");
    const store = tx.objectStore("pointTypes");
    store.put({ id: "pointTypes", value: types });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ポイント種類取得
export async function getPointTypes() {
  const db = await openDB();
  return new Promise<string[]>((resolve, reject) => {
    const tx = db.transaction("pointTypes", "readonly");
    const store = tx.objectStore("pointTypes");
    const request = store.get("pointTypes");
    request.onsuccess = () => resolve(request.result?.value || []);
    request.onerror = () => reject(request.error);
  });
}

// ポイント種類削除
export async function deletePointType(type: string) {
  const current = await getPointTypes();
  const updated = current.filter((t) => t !== type);
  await savePointTypes(updated);
  return updated; // 更新後の配列を返す
}
