import React, { Fragment } from 'react';

import { Grid, Container } from '@material-ui/core';

import { Header, FileTable, FileUploader } from '../../layout-components';
import * as Ipfs from 'ipfs';
import {
  asyncLocalStorage,
  onError,
  onSuccess,
  generateKey,
  clearDbs,
  addToDb,
  createUserFileDB

} from '../../utils/helper';
import hero9 from '../../assets/images/preview.jpg';
let node,
  workspace,
  info = {};
  let PFILES =[];
const handelIPFSUpload = async(fileName,stream,file,startTime) => {
  const fileAdded = await node.add(
    {
      path: fileName,
      content: stream
    },
    {
      wrapWithDirectory: true
     // progress: updateProgressPrivate
    }
  );
  
  if (!PFILES.includes(fileAdded.cid.toString())) {
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
      hash: fileAdded.cid.toString(),
      size: file.size
    };
    await addToDb('privateFiles', dbData, db);
    console.log(
      `************ File has been saved to localstorage***************`
    );

   const cid = fileAdded.cid.toString();

    //  resetProgressPrivate();
    //  updateStorage();
    // pinFile(fileAdded.cid.toString());

    // appendFilePrivate(file.name, fileAdded.cid.toString(), file.size);
    console.log(`we have received ***${fileName} in complete****`);
  } else {
    //  onError("The file is already in the current workspace.")
    //  resetProgressPrivate();
  }};
const LandingPage = () => {
  start();

  return (
    <Fragment>
      <Header />
      <div className="hero-wrapper bg-composed-wrapper bg-premium-dark min-vh-100">
        <div className="flex-grow-1 w-100 d-flex align-items-center">
          <div
            className="bg-composed-wrapper--image opacity-5"
            style={{ backgroundImage: 'url(' + hero9 + ')' }}
          />

          <div className="bg-composed-wrapper--bg bg-second opacity-3" />
          <div className="bg-composed-wrapper--bg bg-red-lights opacity-1" />
          <div className="bg-composed-wrapper--content pt-5 pb-2 py-lg-5">
            <Container maxWidth="md" className="pb-5">
              <Grid container spacing={4}>
                <Grid
                  item
                  lg={10}
                  className="px-0 mx-auto d-flex align-items-center">
                  <div className="text-center">
                    {/* <Tooltip arrow placement="top" title="Version: 1.0.0">
                      <span className="badge badge-success px-4 text-uppercase h-auto py-1">
                      </span>
                    </Tooltip> */}
                    <div className="px-4 px-sm-0 text-white mt-4">
                      {/* <h1 className="display-2 mb-5 font-weight-bold">
                      Web3 Drive

                      </h1> */}

                      <FileUploader
                        node={node}
                        handelUpload={(fileName,stream,file,startTime) => handelIPFSUpload(fileName, stream, file, startTime)}
                      />

                      <FileTable />
                      {/* <p className="font-size-xl text-black mb-3">
                      Your decentralized storage hub
.
                      </p>
                      <p className="text-black font-size-lg">
                      Web3 Drive is the user gate for the decentralized storage world. it acts as a decentralized drive where user can upload, download his large files in a secure way .
                      </p> */}
                      <div className="divider border-2 border-light my-5 border-light opacity-2 mx-auto rounded-circle w-50" />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
async function start() {
  if (!node) {
    const nowtime = new Date().getTime();
    let nodex = localStorage.getItem('nodeid');
    let encryptionKey = await asyncLocalStorage.getItem('encryptionKey');
    // console.log({ encryptionKey });
    const eworker = await asyncLocalStorage.getItem('eworker');
    const dworker = await asyncLocalStorage.getItem('dworker');
    console.log({ eworker, dworker });
    if (eworker) {
      clearDbs('eworker', eworker);
    } else if (dworker) {
      clearDbs('dworker', dworker);
    } else {
    }
    if (!encryptionKey) {
      // call generate key
      await asyncLocalStorage.setItem(
        'encryptionKey',
        await generateKey('test')
      );
    }
    if (!nodex) {
      nodex =
        new Date().getTime() +
        Math.random() +
        Math.random() +
        Math.random() +
        Math.random();
      localStorage.setItem('nodeid', nodex);
    }
    node = await Ipfs.create({
      repo: 'ipfs-' + nodex,
      config: {
        Addresses: {
          Swarm: [
            // This is a public webrtc-star server
            // '/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star'
            //'/dns4/higdon.space/tcp/80/ws/p2p-webrtc-star/'
          ]
        },
        // If you want to connect to the public bootstrap nodes, remove the next line
        Bootstrap: [
          '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
          '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
          '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
          '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
          '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
          '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
          '/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
          '/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
          '/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
          '/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN'
        ],
        // Bootstrap: ['/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/ipfs/QmfLfCnQPGgpP6FvsrzifWmzP647GSayeXfCiXhFDLzc2p', '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star/', '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd', '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3', '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM', '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu', '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm', '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',    '/dns4/1.pubsub.aira.life/tcp/443/wss/ipfs/QmdfQmbmXt6sqjZyowxPUsmvBsgSGQjm4VXrV7WGy62dv8', '/dns4/2.pubsub.aira.life/tcp/443/wss/ipfs/QmPTFt7GJ2MfDuVYwJJTULr6EnsQtGVp8ahYn9NSyoxmd9', '/dns4/3.pubsub.aira.life/tcp/443/wss/ipfs/QmWZSKTEQQ985mnNzMqhGCrwQ1aTA6sxVsorsycQz9cQrw'],
        Pubsub: {
          Enabled: true
        }
      }
    });

    try {
      info = await node.id();
      console.log(info, 'info');

      const addressesHtml = info.addresses
        .map(address => {
          return `<li><pre>${address}</pre></li>`;
        })
        .join('');
      // $nodeId.innerText = info.id;
      // $nodeAddresses.innerHTML = addressesHtml;
      // $allDisabledButtons.forEach(b => {
      //   b.disabled = false;
      // });
      // $allDisabledInputs.forEach(b => {
      //   b.disabled = false;
      // });
      // $allDisabledElements.forEach(el => {
      //   el.classList.remove('disabled');
      // });
    } catch (err) {
      return onError(err);
    }

    onSuccess('Node is ready.');
    // bootstrapUserFile();
    // updateStorage();
    try {
      await subscribeToWorkpsace();
    } catch (err) {
      err.message = `Failed to subscribe to the workspace: ${err.message}`;
      return onError(err);
    }

    window.addEventListener('hashchange', async () => {
      try {
        await workspaceUpdated();
      } catch (err) {
        err.message = `Failed to subscribe to the updated workspace: ${err.message}`;
        onError(err);
      }
    });
  }
}
/* ===========================================================================
         Pubsub
         =========================================================================== */

const messageHandler = message => {
  // const myNode = info.id.toString()
  // const hash = message.data.toString()
  // const messageSender = message.from
  // // append new files when someone uploads them
  // if (myNode !== messageSender && !FILES.includes(hash)) {
  //   // need to fix this later on may be we can check for var!
  //   $cidInput.value = hash
  //   getFile(hash)
  //   //getFilePrivate(hash)
  // }
  // else if (myNode !== messageSender && !PFILES.includes(hash)) {
  //   // need to fix this later on may be we can check for var!
  //   $cidInputPrivate.value = hash
  //   getFilePrivate(hash)
  // }
};

const subscribeToWorkpsace = async () => {
  await node.pubsub.subscribe(workspace, messageHandler);
  const msg = `Subscribed to workspace '${workspace}'`;
  // $logs.innerHTML = msg
};

// unsubscribe from old workspace and re-subscribe to new one
const workspaceUpdated = async () => {
  await node.pubsub.unsubscribe(workspace);
  // clear files from old workspace
  // FILES = []
  // $fileHistory.innerHTML = ''
  // $fileHistoryPrivate.innerHTML = ''

  workspace = window.location.hash.replace(/^#/, '');
  await subscribeToWorkpsace();
};

const publishHash = hash => {
  const data = Buffer.from(hash);
  return node.pubsub.publish(workspace, data);
};

export default LandingPage;
