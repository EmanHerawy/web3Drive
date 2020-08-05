// src/js/components/Form.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initIPFS } from '../../reducers/data';
import * as Ipfs from 'ipfs';
import {
  asyncLocalStorage,
  onError,
  onSuccess,
  generateKey,
  clearDbs
} from '../../utils/helper';

function mapDispatchToProps(dispatch) {
  return {
    initNode: node => dispatch(initIPFS(node))
  };
}

class IPFSNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: {},
      workspace: {},
      info: {}
    };
  }

  componentDidMount() {
    this.startNode().then(()=>{
        const { node } = this.state;
        console.log(node,'nodenode');
        
        this.props.initNode(node);
    })
 
  }
  async startNode() {
    // const nowtime = new Date().getTime();
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
    this.state.node = await Ipfs.create({
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
      this.state.info = await this.state.node.id();
      console.log(this.state.info, 'info');

      //   const addressesHtml =   this.state.info.addresses
      //     .map(address => {
      //       return `<li><pre>${address}</pre></li>`;
      //     })
      //     .join('');
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
        console.log(err,'errrr');
        
      err.message = `Failed to subscribe to the workspace: ${err.message}`;
      //return onError(err);
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
  render() {
    const { info } = this.state;
    return (
      <span></span>
      //   <form onSubmit={this.handleSubmit}>
      //     <div>
      //       <label htmlFor="title">Title</label>
      //       <input
      //         type="text"
      //         id="title"
      //         value={title}
      //         onChange={this.handleChange}
      //       />
      //     </div>
      //     <button type="submit">SAVE</button>
      //   </form>
    );
  }
}

const IPFS = connect(null, mapDispatchToProps)(IPFSNode);

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
  await this.state.node.pubsub.subscribe(this.state.workspace, messageHandler);
  const msg = `Subscribed to workspace '${this.state.workspace}'`;
  // $logs.innerHTML = msg
};

// unsubscribe from old workspace and re-subscribe to new one
const workspaceUpdated = async () => {
  await this.state.node.pubsub.unsubscribe(this.state.workspace);
  // clear files from old workspace
  // FILES = []
  // $fileHistory.innerHTML = ''
  // $fileHistoryPrivate.innerHTML = ''

  this.state.workspace = window.location.hash.replace(/^#/, '');
  await subscribeToWorkpsace();
};

const publishHash = hash => {
  const data = Buffer.from(hash);
  return this.state.node.pubsub.publish(this.state.workspace, data);
};
export default IPFS;
