import React, { Fragment } from 'react';

import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { IconButton, Box } from '@material-ui/core';

import projectLogo from '../../assets/images/icon-cloud.png';

const HeaderLogo = () => {
  return (
    <Fragment>
      <div className={clsx('app-header-logo', {})}>
        <Box
          className="header-logo-wrapper"
          title="Web3 Drive, Your decentralized storage hub<">
          <Link to="/DashboardDefault" className="header-logo-wrapper-link">
            <IconButton
              color="primary"
              size="medium"
              className="header-logo-wrapper-btn">
              <img
                className="app-header-logo-img"
                alt="Web3 Drive, Your decentralized storage hub<"
                src={projectLogo}
              />
            </IconButton>
          </Link>
          <Box className="header-logo-text">Web3 Drive</Box>
        </Box>
      </div>
    </Fragment>
  );
};

export default HeaderLogo;
