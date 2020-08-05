

  // worker.js
const workercode = () => {
  let self = this;
  onmessage =   function (e) {
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    async function readFileByChunk(index, file, key) {
      // console.log(index, file, 'index,content readFileByChunk');
      console.log(key, 'key');

      let chunksize = 1000016;
      let f = file,//.content,
      chunks = Math.ceil(f.byteLength / chunksize),
        decryptedChunk = [];


      for (let j = 0; j < chunks; j++) {
        let start = j * chunksize;
        let end = (j + 1) * chunksize < f.length ? (j + 1) * chunksize : f.length
        let blob = f.slice(start, end);
        // console.log({ blob: blob.buffer });

        let decrypted = { index: j, palintxt: await decrypt(blob.buffer, key) };
        // console.log(decrypted, 'decrypted');

        decryptedChunk = decryptedChunk.concat(decrypted.index);
        postMessage({ index, decrypted, isFinised: chunks == decryptedChunk.length });


        if (chunks == decryptedChunk.length) {
          // console.log(chunks == decryptedChunk.length, 'chunks == decryptedChunk.length');


          self.close();


        }
        if (decryptedChunk.length % 3 == 0) {
          await sleep(3000);

        }

      }

    }





    async function decrypt(encryptedText, keyObject) {
      // const textDecoder = new TextDecoder("utf-8");
      const decryptedText = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: keyObject.iv }, keyObject.key, encryptedText);
      return new Uint8Array(decryptedText, 0);//textDecoder.decode(decryptedText);
    }

    console.log(e.data, 'e.data');

    readFileByChunk(e.data.index, e.data.file, e.data.key);



  }
  };
  
  let code = workercode.toString();
  code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));
  
  const blob = new Blob([code], {type: "application/javascript"});
  const worker_script = URL.createObjectURL(blob);
  
export default worker_script;
  
  