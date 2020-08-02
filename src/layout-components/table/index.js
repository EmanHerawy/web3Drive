import React, { Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

 import { List ,LoadTableData} from '../../page-components/table/full-table/data-table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, Button } from '@material-ui/core';
 

export default function FileTable() {
  // populate data

  return (
    <Fragment>
         <Card className="card-box mb-4">
          <div className="card-header">
            <div className="card-header--title">
              <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
                File list
              </h4>
            </div>
          </div>
          <LoadTableData/>
          <div className="card-body px-0 pt-2 pb-3">
          <PerfectScrollbar className="scroll-area-lg shadow-overflow">

            <table className="table table-hover table-borderless table-alternate text-nowrap mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="text-center">CID</th>
                  <th className="text-center">Size</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <List />
            </table>
          </PerfectScrollbar>
            <div className="divider mb-3" />
            {/* <div className="text-center">
              <Button color="primary">
                <span className="btn-wrapper--label">View details</span>
                <span className="btn-wrapper--icon">
                  <FontAwesomeIcon icon={['fas', 'chevron-right']} />
                </span>
              </Button>
            </div> */}
          </div>
        </Card>
    </Fragment>
  );
}
