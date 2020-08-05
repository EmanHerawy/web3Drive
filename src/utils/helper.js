import {
  Observable
} from 'rxjs';
import Swal from 'sweetalert2';

export const asyncLocalStorage = {
  setItem: (key, value) => {
    return Promise.resolve().then(() => {
      localStorage.setItem(key, value);
      return true;
    });
  },
  getItem: key => {
    return Promise.resolve().then(() => {
      const data = localStorage.getItem(key);
      // localStorage.removeItem(key)
      return data;
    });
  },
  removeItem: key => {
    return Promise.resolve().then(() => {
      localStorage.removeItem(key);
      return true;
    });
  }
};
export function downloadObjectAsJson(exportObj, exportName) {
  let dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function downloadFile(fileName, data, cid) {
  // console.log({ fileName });
  // fileName = URLEncoder.encode(fileName, "UTF-8");
  // console.log({ fileName });

  const file = new window.Blob([data], {
    type: 'application/octet-binary;charset=UTF-8'
  });
  const url = window.URL.createObjectURL(file);
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

export async function exportFile() {
  let userData = {};

  userData.nodex = localStorage.getItem('nodeid');
  // userData.encryptionKey = await asyncLocalStorage.getItem('encryptionKey');
  // get user data from indexdb
  // userData.publicFiles = await getPubData();
  userData.privateFiles = await getPrData();
  console.log({
    userData
  });
  // download the file
  downloadObjectAsJson(userData, 'userData');
}

// export function getPubData() {
//   return new Promise(function (resolve, reject) {
//     let publicFiles = [];
//     getUserFiles('publicFiles').subscribe(
//       data => {
//         // console.log({ data });
//         publicFiles.push({
//           name: data.name,
//           cid: data.cid,
//           size: data.size
//         });
//       },
//       err => {
//         console.log({
//           err
//         });
//         onError(err);

//         reject(err);
//       },
//       x => {
//         // <----
//         console.log('complete');
//         resolve(publicFiles);
//       }
//     );
//   });
// }
export function getPrData() {
  return new Promise((resolve, reject) => {
    let privateFiles = [];
    getUserFiles('privateFiles').subscribe(
      data => {
        // console.log({ data });
        privateFiles.push({
          name: data.name,
          cid: data.cid,
          size: data.size
        });
      },
      err => {
        console.log({
          err
        });
        onError(err);

        reject(err);
      },
      x => {
        // <----
        console.log('complete');
        resolve(privateFiles);
      }
    );
  });
}
export function getTableData() {
  return new Promise((resolve, reject) => {
    let privateFiles = [];
    getUserFiles('privateFiles').subscribe(
      data => {
        console.log({ data });
        privateFiles.push({
          name: data.name,
          cid: data.cid,
          size: data.size,
          key: data.key
        });
      },
      err => {
        console.log({
          err
        });
        onError(err);

        reject(err);
      },
      x => {
        // <----
        console.log('complete');
        resolve(privateFiles);
      }
    );
  });
}

export const getFromDbEncryptedData = function (tableName, dbName, index) {
  return Observable.create(async observer => {
    const db = await createDB(dbName, 1);
    const tx = db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const request = store.openCursor();
    tx.onerror = e => observer.error(e.target.error);
    request.onsuccess = e => {
      const cursor = e.target.result;

      if (cursor) {
        // alert(`Title: ${cursor.key} Text: ${cursor.value} `)
        //do something with the cursor
        cursor.continue();
        // console.log(cursor.value);

        observer.next({
          index: index,
          innerindex: cursor.value.index,
          cipher: cursor.value.cipher
        });
      } else {
        // no more result
        // console.log({ tableName, db });
        removeDb(dbName)
          .then(() => {
            observer.complete();
          })
          .catch(err => {
            onError(err);
          });
      }
    };
  }); //.subscribe(s=>s)
};
export const getUserFiles = function (tableName) {
  return Observable.create(async observer => {
    const db = await createUserFileDB();
    const tx = db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const request = store.openCursor();
    tx.onerror = e => observer.error(e.target.error);
    request.onsuccess = e => {
      const cursor = e.target.result;

      if (cursor) {
        // alert(`Title: ${cursor.key} Text: ${cursor.value} `)
        //do something with the cursor
        cursor.continue();
        // console.log(cursor.value);

        observer.next({
          name: cursor.value.name,
          cid: cursor.value.cid,
          key: cursor.value.key,
          size: cursor.value.size
        });
      } else {
        // no more result
        // console.log({ tableName, db });

        observer.complete();
      }
    };
  }); //.subscribe(s=>s)
};
export const getDecryptedData = function (tableName, dbName, index) {
  return Observable.create(async observer => {
    const db = await createDB(dbName, 1);
    const tx = db.transaction(tableName, 'readonly');
    const store = tx.objectStore(tableName);
    const request = store.openCursor();
    tx.onerror = e => observer.error(e.target.error);
    request.onsuccess = e => {
      const cursor = e.target.result;

      if (cursor) {
        // alert(`Title: ${cursor.key} Text: ${cursor.value} `)
        //do something with the cursor
        cursor.continue();
        // console.log({ cursorValue: cursor.value });

        observer.next({
          index: index,
          innerindex: cursor.value.index,
          palintxt: cursor.value.palintxt
        });
      } else {
        // no more result
        // console.log({ tableName, db });
        removeDb(dbName)
          .then(() => {
            observer.complete();
            console.log(`${dbName}removed`);
          })
          .catch(err => {
            onError(err);
          });
      }
    };
  }); //.subscribe(s=>s)
};

export function addToDb(tableName, obj, db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(tableName, 'readwrite');
    tx.onerror = e => reject(e.target.error);
    const store = tx.objectStore(tableName);
    store.add(obj);
    // console.log({obj});

    resolve(store);
  });
}
export function getSingleValue(tableName, index, db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(tableName, 'readwrite');
    tx.onerror = e => reject(e.target.error);
    const store = tx.objectStore(tableName);
    const request = store.get(index);
    // console.log({obj});
    request.onerror = e => reject(e.target.error);
    request.onsuccess = e => resolve(request.result);

  });
}
export function updateSingleValue(tableName, index, key, db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(tableName, 'readwrite');
    tx.onerror = e => reject(e.target.error);
    const store = tx.objectStore(tableName);
    const request = store.get(index);
    // console.log({obj});
    request.onerror = e => reject(e.target.error);
    request.onsuccess = e => {
      var data = e.target.result;

      // update the value(s) in the object that you want to change
      data.key = key;

      // Put this updated object back into the database.
      var requestUpdate = store.put(data);
      requestUpdate.onerror = function (event) {
        // Do something with the error
      };
      requestUpdate.onsuccess = function (event) {
        // Success - the data is updated!
      };
    }
  });
}


export function clearUserData(tableName) {
  return new Promise(async (resolve, reject) => {
    const db = await createUserFileDB();
    const tx = db.transaction(tableName, 'readwrite');
    tx.onerror = e => reject(e.target.error);
    const store = tx.objectStore(tableName);
    const objectStoreRequest = store.clear();
    objectStoreRequest.onsuccess = e => {
      // console.log({ db });

      resolve(true);
    };
    // console.log({obj});
  });
}
export function removeFromDb(tableName, key, db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(tableName, 'readwrite');

    tx.onerror = e => reject(e.target.error);
    const store = tx.objectStore(tableName);
    store.delete(key);
    // console.log({obj});

    resolve(store);
  });
}
export function removeDb(dbName) {
  return new Promise((resolve, reject) => {
    let x = indexedDB.deleteDatabase(dbName);
    // console.log({ x, dbName });

    resolve(true);
  });
}
export function indexedDBOk() {
  return 'indexedDB' in window;
}
export function createDB(dbName, dbVersion) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    // console.log(request, 'request');

    //on upgrade needed
    request.onupgradeneeded = e => {
      let db = e.target.result;
      const encryptedData = db.createObjectStore('encryptedData', {
        keyPath: 'index'
      });
      const decryptedData = db.createObjectStore('decryptedData', {
        keyPath: 'index'
      });
      // console.log({ encryptedData, encryptedData, db });
    };
    //on success
    request.onsuccess = e => {
      let db = e.target.result;
      // console.log({ db });

      resolve(db);
    };
    //on error
    request.onerror = e => {
      // console.log(e, 'eee');

      reject(e);
    };
  });
}
export function createUserFileDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('userFiles', 1);
    // console.log(request, 'request');

    //on upgrade needed
    request.onupgradeneeded = e => {
      let db = e.target.result;
      const encryptedData = db.createObjectStore('publicFiles', {
        keyPath: 'cid'
      });
      const decryptedData = db.createObjectStore('privateFiles', {
        keyPath: 'cid'
      });
      // console.log({ encryptedData, encryptedData, db });
    };
    //on success
    request.onsuccess = e => {
      let db = e.target.result;
      // console.log({ db });

      resolve(db);
    };
    //on error
    request.onerror = e => {
      // console.log(e, 'eee');

      reject(e);
    };
  });
}
/***********************/
const hash = 'SHA-256';
const salt = window.crypto.getRandomValues(new Uint8Array(16)); //"SALT";
const password = 'PASSWORD';
const iteratrions = 1000;
const keyLength = 48;

export async function getDerivation(
  hash,
  salt,
  password,
  iterations,
  keyLength
) {
  const textEncoder = new TextEncoder('utf-8');
  const passwordBuffer = textEncoder.encode(password);
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const saltBuffer = textEncoder.encode(salt);
  const params = {
    name: 'PBKDF2',
    hash: hash,
    salt: saltBuffer,
    iterations: iterations
  };
  const derivation = await crypto.subtle.deriveBits(
    params,
    importedKey,
    keyLength * 8
  );
  // console.log(derivation, 'derivation');

  return derivation;
}

export async function getKey(derivation) {
  const ivlen = 16;
  const keylen = 32;
  const derivedKey = derivation.slice(0, keylen);
  const iv = derivation.slice(keylen);
  const importedEncryptionKey = await crypto.subtle.importKey(
    'raw',
    derivedKey, {
      name: 'AES-CBC'
    },
    false,
    ['encrypt', 'decrypt']
  );
  return {
    key: importedEncryptionKey,
    iv: iv
  };
}

export async function encrypt(text, keyObject) {
  try {
    const textEncoder = new TextEncoder('utf-8');
    const textBuffer = textEncoder.encode(text);
    const encryptedText = await crypto.subtle.encrypt({
        name: 'AES-CBC',
        iv: keyObject.iv
      },
      keyObject.key,
      textBuffer
    );
    return encryptedText;
  } catch (error) {
    //onError(error)
  }
}

export async function decrypt(encryptedText, keyObject) {
  try {
    const textDecoder = new TextDecoder('utf-8');
    const decryptedText = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv: keyObject.iv
      },
      keyObject.key,
      encryptedText
    );
    return textDecoder.decode(decryptedText);
  } catch (error) {
    console.log({
      error
    });
    ////onError(error)
  }
}

export async function encryptData(text) {
  // console.log('encrypt name');

  const derivation = hexStringToUint8Array(
    await asyncLocalStorage.getItem('encryptionKey')
  );
  // const derivation = await getDerivation(hash, salt, password, iteratrions, keyLength);
  // console.log(derivation, 'derivation');

  const keyObject = await getKey(derivation);
  const encryptedObject = await encrypt(JSON.stringify(text), keyObject);
  return encryptedObject;
}

export async function decryptData(encryptedObject) {
  // console.log(encryptedObject, 'encryptedObject');

  const derivation = hexStringToUint8Array(
    await asyncLocalStorage.getItem('encryptionKey')
  );
  // console.log(derivation, 'derivation');

  // const derivation = await getDerivation(hash, salt, password, iteratrions, keyLength);
  const keyObject = await getKey(derivation);
  // console.log({ encryptedObject, keyObject });

  const decryptedObject = await decrypt(encryptedObject, keyObject);
  return JSON.parse(decryptedObject);
}
export async function generateKey(pass) {
  const derivation = await getDerivation(
    hash,
    salt,
    pass,
    iteratrions,
    keyLength
  );

  const randomizedKey = bytesToHexString(derivation);
  // console.log(randomizedKey, 'randomizedKey');

  return randomizedKey;
}
export function hexStringToUint8Array(hexString) {
  if (hexString.length % 2 != 0) throw 'Invalid hexString';
  let arrayBuffer = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < hexString.length; i += 2) {
    let byteValue = parseInt(hexString.substr(i, 2), 16);
    if (byteValue == NaN) throw 'Invalid hexString';
    arrayBuffer[i / 2] = byteValue;
  }

  return arrayBuffer;
}
export function bytesToHexString(bytes) {
  if (!bytes) return null;

  bytes = new Uint8Array(bytes);
  let hexBytes = [];

  for (let i = 0; i < bytes.length; ++i) {
    let byteString = bytes[i].toString(16);
    if (byteString.length < 2) byteString = '0' + byteString;
    hexBytes.push(byteString);
  }

  return hexBytes.join('');
}

export function onSuccess(msg) {
  // $logs.classList.add('success')
  // $logs.innerHTML = msg
  // call sweetalert2 here
  // Swal.fire({
  //   position: 'top-end',
  //   icon: 'success',
  //   title: msg,
  //   showConfirmButton: false,
  //   timer: 1500
  // })
}
export function clearDbs(identifier, number) {
  Array.from(Array(number).keys()).map(j => {
    removeDb(`${identifier}${j}`)
      .then(async () => {
        onSuccess(`${identifier}${j} has been cleared`);
        if (j + 1 == number)
          await asyncLocalStorage.removeItem(`${identifier}`);
      })
      .catch(err => {
        onError(err);
      });
  });
}

export function onError(err) {
  // console.log(err)
  let msg = 'An error occured, check the dev console';

  if (err.stack !== undefined) {
    msg = err.stack;
  } else if (typeof err === 'string') {
    msg = err;
  }

  // $logs.classList.remove('success')
  // $logs.innerHTML = msg
  Swal.fire({
    position: 'top-end',
    icon: 'error',
    title: msg,
    showConfirmButton: false,
    timer: 1500
  });
}
export function concatArrayBuffers(bufs) {
  let offset = 0;
  let bytes = 0;
  let bufs2 = bufs.map(function (buf, total) {
    bytes += buf.byteLength;
    return buf;
  });
  let buffer = new ArrayBuffer(bytes);
  let store = new Uint8Array(buffer);
  bufs2.forEach(function (buf) {
    store.set(new Uint8Array(buf.buffer || buf, buf.byteOffset), offset);
    offset += buf.byteLength;
  });
  return buffer;
}

export function preChunkingSetup(size) {
  const logicalProcessors = window.navigator.hardwareConcurrency;
  // proposed worker shoud be up to 3 or 4
  var chunksize = 1000016;
  let chunks = Math.ceil(size / chunksize);
  // proposed worker shoud be up to 3 or 4
  // console.log(chunks, 'chunks');
  let maxWorkers = 1;
  if (chunks < 5) {
    maxWorkers = 1;
  } else if (chunks < 10) {
    maxWorkers = 2;
  } else {
    maxWorkers = Math.ceil(logicalProcessors / 2);
  }

  // how many elements each worker should sort
  const segmentsPerWorker = Math.round(chunks / maxWorkers);
  const chunkSizePerWorker =
    maxWorkers == 1 ? size : chunksize * segmentsPerWorker;
  // console.log(chunkSizePerWorker, segmentsPerWorker, 'chunkSizePerWorker');

  console.log(`starting decryption ${maxWorkers} workers`);
  return {
    maxWorkers,
    chunkSizePerWorker
  };
}

export async function removePin(hash, node) {
  if (hash) {
    console.log('Remove Pinn...');
    const pinset = await node.pin.rm(hash);
    console.log(pinset);
    onSuccess(`Pin removed.`);
  } else {
    onError("Can't remove pin for empty CID");
  }
}

export async function getPINS(event, node) {
  for await (const {
    cid,
    type
  } of node.pin.ls()) {
    console.log({
      cid,
      type
    });
  }
}
export function getPIN(hash, node) {
  return new Promise(async (resolve, reject) => {
    for await (const {
      cid,
      type
    } of node.pin.ls()) {
      // console.log({ cid, type })
      if (cid == hash) {
        resolve(true);
      }
    }
    resolve(false);
  });
}
