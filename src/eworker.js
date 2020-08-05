// worker.js
const workercode = () => {
let self = this;
onmessage =  (e)=> {

console.log('hist worker');

    const sleep = (milliseconds) => {
      // console.log('*************Sleep********************');

      return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    async function readFileByChunk(index, file, key) {



      let chunksize = 1000000;
      let i = 0,

        chunks = Math.ceil(file.size / chunksize),
        chunkTasks = [],
        encryptedChunk = [],
        startTime = (new Date()).getTime();
      // console.log(startTime, 'startTime');
      // console.log(file.size, 'file size');

      for (let j = 0; j < chunks; j++) {
        // console.log('loop');
        // sleep each two chunks for one sec




        // console.log(reader, 'reader');
        // console.log(f, j, 'f+ j');
        let start = j * chunksize;
        let end = (j + 1) * chunksize < file.size ? (j + 1) * chunksize : file.size
        let blob = file.slice(start, end);
        // console.log(blob, 'blob');


        let reader = new FileReader();

        reader.onload = async function (e) {
          let chunk = e.target.result;
          console.log(key, ' key');
          let encrypted = { index: j, cipher: await encrypt(chunk, key) };

          console.log({ encrypted, index }, 'encrypted');

          encryptedChunk = encryptedChunk.concat(encrypted.index);
          postMessage({ index, encrypted, isFinised: chunks == encryptedChunk.length });


          if (chunks == encryptedChunk.length) {


            self.close();


          }
          if (encryptedChunk.length % 3 == 0) {
            await sleep(3000);

          }

        };
        reader.readAsArrayBuffer(blob);

      }

    }


    async function encrypt(textBuffer, keyObject) {
      // console.log(keyObject,'keyObject');

      const encryptedText = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: keyObject.iv }, keyObject.key, textBuffer);
      return new Uint8Array(encryptedText, 0);
    }


    console.log(e.data, 'e.data start');
    readFileByChunk(e.data.index, e.data.file, e.data.key);
  }
};

let code = workercode.toString();
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"));

const blob = new Blob([code], {type: "application/javascript"});
const worker_script = URL.createObjectURL(blob);

export default worker_script;

