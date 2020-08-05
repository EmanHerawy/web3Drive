import React, { Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropzone from 'react-dropzone';

import {
  List,
  LoadTableData
} from '../../page-components/table/full-table/data-table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, IconButton, Box } from '@material-ui/core';
import {
  exportFile,
  asyncLocalStorage,
  createUserFileDB,
  addToDb
} from '../../utils/helper';
import { addNewRow } from '../../reducers/data';
import { connect } from 'react-redux';

function Table(props) {
  // populate data
  console.log(props, 'props table');

  const importFile = files => {
    console.log(files, 'e');
    const file = files[0];
    let reader = new FileReader();

    reader.onload = async function(e) {
      let userData = JSON.parse(e.target.result);

      await asyncLocalStorage.setItem('nodeid', userData.nodex);

      const db = await createUserFileDB();

      userData.privateFiles.forEach(async row => {
        const exist = props.tableData.find(item => item.cid == row.cid);
        // console.log(exist,'exist');
        if (!exist) {
          await addToDb('privateFiles', row, db);
          props.addNewRow(row);
        }
      });
    };
    reader.readAsText(file);
  };
  const onCancel = () => {
    // this.setState({
    //   files: []
    // });
  };
  return (
    <Fragment>
      <Card className="card-box mb-4">
        <div className="card-header">
          <div className="card-header--title">
            <h4 className="font-size-lg mb-0 py-2 font-weight-bold">
              Private Vault
            </h4>
          </div>
          <Box className="card-header--actions">
            <IconButton
              size="small"
              // color="success"
              className="text-success"
              // onClick={e => importFile(e)}
              // type="file"
              title="Import">
              {/* <FontAwesomeIcon
                icon={['fas', 'file-import']}
                className="font-size-lg"
              /> */}
              <Dropzone
                onDrop={e => importFile(e)}
                onFileDialogCancel={() => onCancel()}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dz-message">
                      <div className="dx-text">
                        <FontAwesomeIcon
                          icon={['fas', 'file-import']}
                          className="font-size-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Dropzone>
            </IconButton>
            <IconButton
              onClick={() => exportFile()}
              // disabled={!key}
              size="small"
              color="primary"
              className="text-primary"
              title="Export">
              <FontAwesomeIcon
                icon={['fas', 'file-export']}
                className="font-size-lg"
              />
            </IconButton>
          </Box>
        </div>
        <LoadTableData />
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
const mapStateToProps = state => {
  console.log(state.data);

  return { tableData: state.data.tableData };
};
function mapDispatchToProps(dispatch) {
  return {
    addNewRow: row => dispatch(addNewRow(row))
  };
}

const FileTable = connect(mapStateToProps, mapDispatchToProps)(Table);
export default FileTable;
