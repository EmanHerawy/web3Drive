import React, { Fragment, Component } from 'react';

import { Grid } from '@material-ui/core';

import { LinearProgress } from '@material-ui/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Observable, Subject, combineLatest, from } from 'rxjs';
import { mergeMap, toArray, switchMap } from 'rxjs/operators';
import worker_script from '../../eworker';

import {
  createDB,
  addToDb,
  asyncLocalStorage,
  getKey,
  getFromDbEncryptedData,
  encryptData,
  bytesToHexString,
  createUserFileDB,
  hexStringToUint8Array,
  onError
} from '../../utils/helper';

import { connect } from 'react-redux';
import { addNewRow } from '../../reducers/data';

import Dropzone from 'react-dropzone';
let uploader$;

class Uploader extends Component {
  constructor(props) {
    super();

    this.state = {
      showProgress: false,
      completed: 0,
      buffer: 1,
      PFILES: [],
      files: []
    };
    console.log(this.state, '  this.state');
  }
  async handelIPFSUpload(fileName, stream, file, startTime) {
    console.log(this.state, '  this.state');
    console.log(this.props.node, '  this.props');

    const fileAdded = await this.props.node.add(
      {
        path: fileName,
        content: stream
      },
      {
        wrapWithDirectory: true,
        progress: bytesLoaded =>
          this.updateProgressPrivate(bytesLoaded, file.size)
      }
    );

    if (!this.state.PFILES.includes(fileAdded.cid.toString())) {
      let endTime = new Date().getTime();
      let res = Math.abs(startTime - endTime) / 1000;
      let seconds = res % 60;
      console.log({ fileAdded });

      console.log(
        `************ File has been uploaded to IPFS endTime is ${endTime} and total time is ${seconds} seconds***************`
      );

      const db = await createUserFileDB();
      const dbData = {
        name: file.name,
        cid: fileAdded.cid.toString(),
        size: file.size
      };
      await addToDb('privateFiles', dbData, db);
      console.log(
        `************ File has been saved to localstorage***************`
      );

      const cid = fileAdded.cid.toString();
      this.props.addNewRow({
        cid: cid,
        name: file.name,
        size: file.size,
        key: 'sjdcsjfhjsfd'
      });
      this.resetProgress();
      //  updateStorage();
      // pinFile(fileAdded.cid.toString());

      // appendFilePrivate(file.name, fileAdded.cid.toString(), file.size);
      console.log(`we have received ***${fileName} in complete****`);
    } else {
      onError('The file is already in the current workspace.');
      this.resetProgress();
    }
  }
  async onDrop(files) {
    //this.setState({ files });
    uploader$ = new Subject();
    let fileSize = 0;
    this.setState({ showProgress: true });

    let startTime = new Date().getTime();
    console.log(
      `************ File received and being processed startTime is ${startTime} ***************`
    );
    //const files = Array.from(event.dataTransfer.files)

    for (const file of files) {
      fileSize = file.size; // Note: fileSize is used by updateProgress
      // console.log({ fileSize });
      uploader$
        .pipe(switchMap(num => from(Array.from(Array(num).keys()))))
        .pipe(
          mergeMap(index =>
            getFromDbEncryptedData(`encryptedData`, `eworker${index}`, index)
          ),
          toArray()
        )
        .subscribe(
          async data => {
            //workerNum = data;
            // remove workernum from storage
            await asyncLocalStorage.removeItem('eworker');
            // console.log({ data: data.sort((a, b) => { return a.index - b.index }) });
            const cipher = data
              .sort((a, b) => {
                return a.index - b.index;
              })
              .map(s => s.cipher);
            // console.log(cipher[0], 'cipher in drop');
            // console.log({ cipher: cipher[0] });

            const stream = new ReadableStream({
              start(controller) {
                for (let i = 0; i < cipher.length; i++) {
                  // Add the files one by one
                  controller.enqueue(cipher[i]);
                }

                // When we have no more files to add, close the stream
                controller.close();
              }
            });
            // console.log(file.name, 'file.name');
            // const name = file.name.replace(/\.[^/.]+$/, '');
            // const name = file.name.replace(/"([^"]+(?="))"/g, '$1');
            // console.log(name, 'name');

            const fileName = bytesToHexString(await encryptData(file.name));
            // console.log({ fileName });
            this.handelIPFSUpload(fileName, stream, file, startTime);

            // let x = await mockedGetFile(new Buffer(data));
          },
          err => {
            console.log({ err });
            onError(err);

            this.resetProgress();
          }
        );

      encryptWithWorkers(file);
    }
    console.log('************ File is uploading  ***************');
  }

  updateProgressPrivate(bytesLoaded, fileSize) {
    console.log(bytesLoaded, fileSize, 'bytesLoaded, fileSize');

    let percent = (bytesLoaded / fileSize) * 100;
    this.setState({
      completed: percent,
      buffer: percent + 10
    });
    console.log('hit progress percent,bytesLoaded,fileSize', percent);
  }
  resetProgress() {
    this.setState({
      completed: 0,
      buffer: 1,
      showProgress: false
    });
  }
  onCancel() {
    this.setState({
      files: []
    });
  }

  render() {
    const { completed, buffer, showProgress } = this.state;
    return (
      <Fragment>
        <Grid container spacing={4} className="mt-4">
          <Grid item xs={12} sm={12}>
            <div className="dropzone">
              <Dropzone
                onDrop={this.onDrop.bind(this)}
                onFileDialogCancel={this.onCancel.bind(this)}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dz-message">
                      <div className="dx-text">
                        Try dropping some files here, or click to select files
                        to upload. <FontAwesomeIcon icon="file-upload" />
                      </div>
                    </div>
                  </div>
                )}
              </Dropzone>
              {showProgress && (
                <LinearProgress
                  variant="buffer"
                  value={completed}
                  valueBuffer={buffer}
                  className="mb-4"
                  color="secondary"
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}
// we turn the worker activation into a promise
const encryptWorker = (index, arr, key) => {
  console.log(key, 'keysss');

  const encryptor$ = Observable.create(async observer => {
    let db = await createDB(`eworker${index}`, 1);
    // console.log({ db });

    let worker = new Worker(worker_script);
    console.log(worker, 'worker');

    // wait for a message and resolve
    worker.onmessage = ({ data }) => setData(data);
    // if we get an error, reject
    worker.onError = e => observer.error(e);
    // post a message to the worker
    const setData = async data => {
      // observer.next(data)
      // console.log(data.encrypted, 'data.encrypted');

      try {
        await addToDb(`encryptedData`, data.encrypted, db);
        if (data.isFinised) {
          // console.log({ data });
          db.close();
          observer.complete();
        }
      } catch (error) {
        console.log({ error });

        //onError("Hard disk full, please clear some space and try again.")
        console.log('Hard disk full, please clear some space and try again.');
      }
    };
    worker.postMessage({ file: arr, index: index, key: key });
  });
  return encryptor$; //.subscribe(s=>{console.log(s,'ssssssss'); return s}        )
};
async function encryptWithWorkers(file) {
  const derivation = hexStringToUint8Array(
    await asyncLocalStorage.getItem('encryptionKey')
  );
  const key = await getKey(derivation);

  // get number of cores
  const logicalProcessors = window.navigator.hardwareConcurrency;
  // take only half of them
  // const workerNumber = Math.ceil(logicalProcessors / 2);
  // console.log(file.size, 'file.size');

  let startTime = new Date().getTime();
  console.log(startTime, 'startTime for full encryption');
  var chunksize = 1000000;
  let chunks = Math.ceil(file.size / chunksize);
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
  const chunkSizePerWorker = chunksize * segmentsPerWorker;
  // console.log(segmentsPerWorker, 'segmentsPerWorker');
  // console.log(chunkSizePerWorker, 'chunkSizePerWorker');

  console.log(`starting encryption ${maxWorkers} workers`);
  await asyncLocalStorage.setItem('eworker', maxWorkers);

  let observables = Array.from(Array(maxWorkers).keys()).map((s, j) => {
    let start = j * chunkSizePerWorker;
    let end =
      (j + 1) * chunkSizePerWorker < file.size
        ? (j + 1) * chunkSizePerWorker
        : file.size;

    if (j + 1 == maxWorkers) {
      end = file.size;
    }
    var blob = file.slice(start, end);
    return encryptWorker(j, blob, key);
  });
  // let each worker handle it's own part

  // merge all the segments of the array
  // const result = await Promise.all(promises);
  // console.log(observables, 'promises');

  // observables.concat(uploader$.next(maxWorkers),
  //   uploader$.complete())

  combineLatest(observables).subscribe(
    num => {
      // console.log({ num });
    },
    err => {
      console.log({ err });
      //onError(err)
    },
    x => {
      // <----
      console.log('complete');
      uploader$.next(maxWorkers);
      uploader$.complete();
    }
  );

  let endTime = new Date().getTime();
  console.log(endTime, 'end Time for full encryption');
  let res = Math.abs(startTime - endTime) / 1000;
  let seconds = res % 60;
  console.log(seconds, 'elapsed time in seconds for full encryption');
  // return concatArrayBuffers(result.sort((a, b) => { return a.index - b.index }).map(s => s.data).reduce((acc, arr) => acc.concat(arr), []))//result.reduce((acc, arr) => acc.concat(arr), []);
}
function mapDispatchToProps(dispatch) {
  return {
    addNewRow: row => dispatch(addNewRow(row))
  };
}
const mapStateToProps = state => {
  console.log(state.data, 'state');

  return { node: state.data.node };
};
const FileUploader = connect(mapStateToProps, mapDispatchToProps)(Uploader);

export default FileUploader;
