import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, Button } from '@material-ui/core';

import { connect } from 'react-redux';

const mapStateToProps = state => {
  console.log(state.data);

  return { tableData: state.data.tableData };
};

const ConnectedList = ({ tableData }) => (
  <tbody>
    {tableData.map(el => (
      <tr key={el.key}>
        <td>
          <span className="text-black-50 d-block">{el.name}</span>
        </td>
        <td className="text-center">
          <span className="font-weight-bold text-danger">{el.cid}</span>
        </td>
        <td className="text-center">
          <span className="text-danger font-weight-bold">{el.size}</span>
        </td>
        <td className="text-center">
          <span className="badge badge-danger">check pin</span>
        </td>
        <td className="text-right">
          <div className="d-flex align-items-center justify-content-end">
            <div className="font-weight-bold font-size-lg pr-2">22222</div>
            <FontAwesomeIcon
              icon={['fas', 'arrow-down']}
              className="font-size-sm opacity-5"
            />
          </div>
        </td>
      </tr>
    ))}
  </tbody>
);

const List = connect(mapStateToProps)(ConnectedList);
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
        <div className="card-body px-0 pt-2 pb-3 ">
          <table
            className="table table-hover table-borderless table-alternate table-responsive mb-0"
            style={{ 'word-wrap': 'break-word', ' table-layout': 'fixed' }}>
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
          <div className="divider mb-3" />
          <div className="text-center">
            <Button color="primary">
              <span className="btn-wrapper--label">View details</span>
              <span className="btn-wrapper--icon">
                <FontAwesomeIcon icon={['fas', 'chevron-right']} />
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </Fragment>
  );
}
