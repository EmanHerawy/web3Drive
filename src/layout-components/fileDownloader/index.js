import React, { Fragment, Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Subject, combineLatest, from, Observable } from 'rxjs';
import { mergeMap, toArray, switchMap } from 'rxjs/operators';
import { IconButton, Box } from '@material-ui/core';
import { LinearProgress } from '@material-ui/core';
import Swal from 'sweetalert2';

import {
  getDecryptedData,
  hexStringToUint8Array,
  decryptData,
  concatArrayBuffers,
  downloadFile,
  preChunkingSetup,
  onSuccess,
  onError,
  getKey,
  addToDb,
  createUserFileDB,
  updateSingleValue,
  removeFromDb,
  getPIN,
  removePin,
  createDB,
  asyncLocalStorage
} from '../../utils/helper';
import worker_script from '../../dworker';

import { connect } from 'react-redux';
import { removeRow, updateRow, addTo3Box } from '../../reducers/data';

let downloader$;

class Downloader extends Component {
  constructor(props) {
    super();

    this.state = {
      ...props,
      row: '',
      key: '',
      showProgress: false,
      completed: 0,
      buffer: 1,
      PFILES: [],
      files: []
    };
    console.log(this.state, '  this.state');
  }
  componentDidMount() {
    console.log(this.props.cid, 'this.props.cid');
    const row = this.props.tableData.filter(item => item.cid == this.props.cid);
    console.log(row, 'rowrow');

    if (row) {
      this.setState({
        row: row,
        key: row[0].key
      });
    }
  }
  async removeFile(cid) {
    console.log(cid, 'remove');
    try {
      this.setState({
        showProgress: true
      });
      this.updateProgress(1, 10);
      const db = await createUserFileDB();
      console.log(cid, 'hash');
      // remove from file array

      this.props.removeRow(cid);
      this.updateProgress(4, 10);

      await removeFromDb('privateFiles', cid, db);
      this.updateProgress(7, 10);

      if (await getPIN(cid, this.props.node)) {
        console.log('true');
        this.updateProgress(8, 10);

        await removePin(cid, this.props.node);
      }
      this.updateProgress(10, 10);
      this.resetProgress();
    } catch (err) {
      err.message = `Failed to remove : ${err.message}`;
      onError(err);
    }
  }
  async syncFile(cid) {
    console.log(this.state.row[0], 'this.state.row[0]');
    try {
      let tempFiles = this.props.boxFiles;

      console.log(this.state.boxFiles, 'this.state.boxFiles');
      console.log(this.props.boxFiles, 'this.props.boxFiles');

      //tempFiles=this.state.boxFiles;

      this.updateProgress(1, 10);
      console.log(tempFiles, 'tempFiles');

      tempFiles = {
        ...tempFiles,
        [`${cid}`]: {
          name: this.state.row[0].name,
          key: this.state.row[0].key,
          size: this.state.row[0].size
        }
      };
      console.log(tempFiles, 'tempFiles');

      this.setState({
        boxFiles: tempFiles
      });
      this.setState({
        showProgress: true
      });
      console.log(this.state, 'this.state.space');

      const result = await this.props.space.private.set(
        'files',
        JSON.stringify(tempFiles)
      );
      console.log(result, 'result');

      this.updateProgress(5, 10);
      console.log(this.state, 'state');

      // remove from file array

      this.props.addTo3Box(tempFiles);

      this.updateProgress(10, 10);
      this.resetProgress();
    } catch (err) {
      err.message = `Failed tkco Sync : ${err.message}`;
      onError(err);
      console.log({
        err
      });
    }
  }
  async download(hash) {
    downloader$ = new Subject();
    let fileName = '';
    let startTime = new Date().getTime();
    // console.log({ hash });
    this.setState({
      showProgress: true
    });
    console.log(
      `************ getting file from IPFS startTime is ${startTime} ***************`
    );

    if (!hash) {
      return onError('No CID was inserted.');
    }

    // PFILES.push(hash)
    // console.log({FILES});

    downloader$
      .pipe(switchMap(num => from(Array.from(Array(num).keys()))))
      .pipe(
        mergeMap(index =>
          getDecryptedData(`decryptedData`, `dworker${index}`, index)
        ),
        toArray()
      )
      .subscribe(
        async data => {
          await asyncLocalStorage.removeItem('dworker');

          //workerNum = data;
          // console.log({ data: data.sort((a, b) => { return a.index - b.index }) });
          const palintxt = concatArrayBuffers(
            data
              .sort((a, b) => {
                return a.index - b.index;
              })
              .map(s => s.palintxt.buffer)
          );
          // console.log({ palintxt });

          // const data = concatArrayBuffers(result.sort((a, b) => { return a.index - b.index }).map(s => s.data).reduce((acc, arr) => acc.concat(arr), []))//result.reduce((acc, arr) => acc.concat(arr), []);
          // console.log({ data });

          console.log('************ File has been decrypted ***************');
          // console.log(fileName, 'fileName');
          const fullName = await decryptData(hexStringToUint8Array(fileName));
          //             console.log(fullName,'name');
          //             // console.log(name.replace(/"([^"]+(?="))"/g, '$1'),'name.replace(/"([^"]+(?="))"/g, '$1')');
          //             const name = fullName.substr(0, fullName.lastIndexOf('.'));
          // console.log(name,'namename');

          downloadFile(fullName, palintxt, hash);
          this.resetProgress();
          let endTime = new Date().getTime();
          let res = Math.abs(startTime - endTime) / 1000;
          let seconds = res % 60;
          console.log(
            `************ getting file from IPFS endTime is ${endTime} and total time is ${seconds} seconds***************`
          );
          onSuccess(`The ${fileName} file was added.`);
        },
        err => {
          console.log({
            err
          });
          onError(err);
        }
      );

    for await (const file of this.props.node.get(hash)) {
      // console.log({ name: file.name });
      // console.log({ file });
      // fileName = await decryptData(hexStringToUint8Array(file.name));
      // console.log({ fileName });
      let encryptionKey = hexStringToUint8Array(this.state.key);
      // let encryptionKey = hexStringToUint8Array(
      //   await asyncLocalStorage.getItem('encryptionKey')
      // );
      // console.log(encryptionKey, 'encryptionKey');
      const key = await getKey(encryptionKey);
      // console.log(key, 'key');
      if (file.content) {
        // console.log(file.size, 'file.content');
        let { maxWorkers, chunkSizePerWorker } = preChunkingSetup(file.size);
        await asyncLocalStorage.setItem('dworker', maxWorkers);

        console.log(
          `************ running ${maxWorkers} workers with  chunk size  ${chunkSizePerWorker} for each worker   ***************`
        );

        let chunkData = Array.from(Array(maxWorkers).keys()).map(j => {
          return new Uint8Array();
        });
        // console.log(chunkData, 'chunkData');

        let indexer = 0;
        let byteCount = 0;
        let runningWorkers = 0;
        let observables = [];
        // let chunkData = new Uint8Array(chunkSizePerWorker);
        let temp = [];
        let offset = 0;
        chunkData[runningWorkers] = new Uint8Array(chunkSizePerWorker);
        fileName = file.name;

        for await (const chunk of file.content) {
          // console.log(chunk, 'chunk');
          console.log(
            `************ getting chunks  from ipfs for worker  ${runningWorkers +
              1} to be decrypted  ***************`
          );

          byteCount += chunk.byteLength;
          indexer += chunk.byteLength;
          this.updateProgress(byteCount, file.size);

          if (indexer < chunkSizePerWorker) {
            chunkData[runningWorkers].set(chunk, offset);

            offset += chunk.byteLength;
          } else {
            console.log(
              `************ Chunk ${runningWorkers +
                1} is Loaded and in decryption process  ***************`
            );

            if (indexer == chunkSizePerWorker) {
              chunkData[runningWorkers].set(chunk, offset);

              offset = 0;
              indexer = 0;

              chunkSizePerWorker =
                runningWorkers + 2 == maxWorkers
                  ? file.size - byteCount
                  : chunkSizePerWorker;
              if (runningWorkers + 1 == maxWorkers) {
                chunkData[runningWorkers + 1] = new Uint8Array(
                  chunkSizePerWorker
                );
                // console.log({ chunkSizePerWorker }, 'if runningWorkers + 1 == maxWorkers');
              }
              // console.log({ chunkSizePerWorker }, 'else');
            } else {
              // console.log(indexer, 'indexer');
              // console.log({ chunkSizePerWorker, chunk });

              const remaining =
                chunk.byteLength - (indexer - chunkSizePerWorker);
              const prev = chunk.slice(0, remaining);
              const next = chunk.slice(remaining);
              // console.log(file.size - byteCount, 'file.size - byteCount');
              // console.log(file.size, byteCount, 'file.size , byteCount');
              // temp.push(prev)

              chunkSizePerWorker =
                runningWorkers + 2 == maxWorkers
                  ? file.size + next.length - byteCount
                  : chunkSizePerWorker;
              chunkData[runningWorkers + 1] = new Uint8Array(
                chunkSizePerWorker
              );
              chunkData[runningWorkers].set(prev, offset);
              chunkData[runningWorkers + 1].set(next, 0);
              // console.log({ chunkSizePerWorker }, 'if');

              indexer = offset = next.byteLength;
              // console.log({ offset });
            }

            observables.push(
              decryptWorker(runningWorkers, chunkData[runningWorkers], key)
            );
            runningWorkers++;
          }
        }
        console.log(observables, 'observables');

        combineLatest(observables).subscribe(
          num => {
            console.log({
              num
            });
          },
          err => {
            console.log({
              err
            });
            onError(err);
          },
          x => {
            // <----
            console.log('complete');
            downloader$.next(maxWorkers);
            downloader$.complete();
          }
        );
      }
    }
  }

  updateProgress(bytesLoaded, fileSize) {
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
  async updateKey() {
    // this.setState({ row: this.props.getRow(this.props.cid) });
    console.log(this.state, 'this.state.row');

    const { value } = await Swal.fire({
      title: 'Enter your IP address',
      input: 'text',
      // inputValue: inputValue,
      showCancelButton: true,
      inputValidator: value => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    });

    if (value) {
      let updatedRow = this.state.row[0];
      updatedRow.key = value;
      this.setState({
        row: updatedRow,
        key: value
      });
      this.props.updateRow({
        row: updatedRow
      });
      const db = await createUserFileDB();
      updateSingleValue('privateFiles', updatedRow.cid, value, db);
      Swal.fire(`Key has been updated `);
    }
  }
  render() {
    const { completed, buffer, showProgress, key } = this.state;
    const { cid, identity,boxFiles } = this.props;
    console.log(key, 'key');
    console.log(boxFiles, 'key boxFiles');

    return (
      <Fragment>
        {' '}
        {showProgress && (
          <LinearProgress
            variant="buffer"
            value={completed}
            valueBuffer={buffer}
            className="mb-4"
            color="secondary"
          />
        )}{' '}
        <Box className="card-header--actions">
          <IconButton
            size="small"
            // color="success"
            className={!key ? 'text-danger' : 'text-success '}
            onClick={() => this.updateKey()}
            title={!key ? 'Add Encryption Key' : 'Update Encryption Key'}>
            <FontAwesomeIcon icon={['fas', 'key']} className="font-size-lg" />
          </IconButton>{' '}
          <IconButton
            onClick={() => this.download(cid)}
            disabled={!key}
            size="small"
            color="primary"
            className="text-primary"
            title="Download">
            <FontAwesomeIcon
              icon={['fas', 'arrow-down']}
              className="font-size-lg"
            />
          </IconButton>
          <IconButton
            size="small"
            // color="danger"
            disabled={!identity}
            onClick={() => this.syncFile(cid)}
            className={
              !(boxFiles && boxFiles.hasOwnProperty(cid))
                ? 'text-danger'
                : 'text-success '
            }
            title="Sync with 3 Box">
            <FontAwesomeIcon icon={['fas', 'sync']} className="font-size-lg" />
          </IconButton>{' '}
          <IconButton
            size="small"
            // color="danger"
            onClick={() => this.removeFile(cid)}
            className="text-danger"
            title="Delete">
            <FontAwesomeIcon
              icon={['fas', 'eraser']}
              className="font-size-lg"
            />
          </IconButton>{' '}
        </Box>{' '}
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeRow: cid => dispatch(removeRow(cid)),
    updateRow: row => dispatch(updateRow(row)),
    removeFrom3Box: row => dispatch(addTo3Box(row)),
    addTo3Box: row => dispatch(addTo3Box(row))
    // ,
    // getRow: cid => dispatch(getRow(cid))
  };
}
const mapStateToProps = state => {
  console.log(state.data, 'state in download');

  return {
    node: state.data.node,
    identity: state.data.identity,
    boxFiles: state.data.boxFiles,
    space: state.data.space,
    tableData: state.data.tableData
  };
};
const decryptWorker = (index, arr, key) => {
  // console.log(index, arr, 'index, arr');
  console.log(key, 'key');

  const decryptor$ = Observable.create(async observer => {
    let db = await createDB(`dworker${index}`, 1);
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
      // console.log(data.decrypted, 'data.palintxt');
      try {
        await addToDb(`decryptedData`, data.decrypted, db);
        if (data.isFinised) {
          // console.log({ data });
          db.close();
          observer.complete();
        }
      } catch (error) {
        console.log({
          error
        });

        onError('Hard disk full, please clear some space and try again.');
        console.log('Hard disk full, please clear some space and try again.');
      }
    };
    console.log({
      file: arr,
      index: index,
      key: key
    });

    worker.postMessage(
      {
        file: arr,
        index: index,
        key: key
      },
      [arr.buffer]
    );
  });
  return decryptor$; //.subscribe(s=>{console.log(s,'ssssssss'); return s}        )
};
const FileDownloader = connect(mapStateToProps, mapDispatchToProps)(Downloader);

export default FileDownloader;
