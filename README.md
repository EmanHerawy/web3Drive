## Web3 Drive
Web3 Drive is the user gate for the decentralized storage world. it acts as a decentralized drive where user can upload, download his large files in a secure way .

# Features 
- Easy upload/download to/from IPFS
- End-to-end encryption option 
- sync metadata in decentralized storage (3box)
- fetch file in ipfs
- import,export,empty file list
- Pinning option to (Filecoin,cloud-based servers) with competitive prices (in progress)
- Upload to Filecoin (in progress)

## Install

To install, download or clone the repo, then:

`npm install`
`npm start`

To view dapp:

`http://localhost:3000`

How it works:

- Upload or drop you file
- unique key is generated and assigned to your file
- file is spitted into smaller chunks and each chunk is encrypted 
- file name is encrypted for extra privacy  
- file is uploaded encrypted 
- file is listed in file list and user can download it decrypted 
- file metadata is saved in user storage ( indexeddb)
- user can connect to his  3box account or create new one 
- user can sync his stored file metadata in his private storage in 3box 
- user can fetch any file and once encryption key is added, he can download it decrypted 
- user can import, export  his file list , 
- user can empty his file list locally and/or  in 3box , 


## stack
- React js
- redux
- web worker
- 3box with textil identity
- indexdb
