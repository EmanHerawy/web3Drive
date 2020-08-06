import React from 'react';

import { initIdentity, addNewRow } from '../../reducers/data';
import { connect } from 'react-redux';
import { get3BoxIdentity } from '../../utils/3box';
import { addToDb, createUserFileDB } from '../../utils/helper';
import Swal from 'sweetalert2';

function IdentityConnect(props) {
  const handleConnect = async () => {
    console.log('connect');
    Swal.fire(`Connecting to you 3Box Account... `);
    const { identity, space, boxFiles } = await get3BoxIdentity();
    props.initIdentity({ identity, space, boxFiles });
    if (boxFiles) {
      const db = await createUserFileDB();

      for (const obj in boxFiles) {
        //console.log(obj, 'obj');
        const exist = props.tableData.find(item => item.cid == obj);
        // console.log(exist,'exist');
        if (!exist) {
          const row = { ...boxFiles[obj], cid: obj };
          console.log(row,'rowrowrow');
          
          await addToDb('privateFiles', row, db);
          props.addNewRow(row);
        }
      }
    }
  };

  return <span onClick={() => handleConnect()}> Connected to your wallet</span>;
}
const mapStateToProps = state => {
  console.log(state.data);

  return {
    identity: state.data.identity,
    tableData: state.data.tableData
  };
};
function mapDispatchToProps(dispatch) {
  return {
    addNewRow: row => dispatch(addNewRow(row)),
    initIdentity: ({ identity, space, boxFiles }) =>
      dispatch(initIdentity({ identity, space, boxFiles }))
  };
}

const BoxIdentityConnect = connect(
  mapStateToProps,
  mapDispatchToProps
)(IdentityConnect);
export default BoxIdentityConnect;
