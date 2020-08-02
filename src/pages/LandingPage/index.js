import React, { Fragment } from 'react';

import { Grid, Container , Card} from '@material-ui/core';

import { ExampleWrapperSeamless } from '../../layout-components';
import { Header, FileUploader, FileTable } from '../../layout-components';
import { IPFSNode } from '../../page-components';

import hero9 from '../../assets/images/preview.jpg';

const LandingPage = () => {
  return (
    <Fragment>
      <Header />
         <div className="hero-wrapper bg-composed-wrapper bg-premium-dark min-vh-100">
          <div className="flex-grow-1 w-100 d-flex align-items-center">
            <div
              className="bg-composed-wrapper--image opacity-5"
              style={{ backgroundImage: 'url(' + hero9 + ')' }}
            />
            <IPFSNode />
            <div className="bg-composed-wrapper--bg bg-second opacity-3" />
            <div className="bg-composed-wrapper--bg bg-red-lights opacity-1" />
            <div className="bg-composed-wrapper--content pt-5 pb-2 py-lg-5">
              <Container maxWidth="xl" className="pb-5">
                <Grid container spacing={5}>
                  <Grid
                    item
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

                        <FileUploader />

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

export default LandingPage;
