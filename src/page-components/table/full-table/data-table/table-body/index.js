import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { FileDownloader } from '../../../../../layout-components';

const mapStateToProps = state => {
  console.log(state.data);

  return { tableData: state.data.tableData };
};



const ConnectedList = ({ tableData }) => (
  <tbody>
    {tableData.map((el, index) => (
      <tr key={index}>
        <td className=" text-break">
          <span className="text-black-50 d-block ">{el.name}</span>
        </td >
        <td className="text-center">
          <span className="font-weight-bold text-primary">{el.cid}</span>
        </td>
        <td className="text-center">
          <span className="text-black-50 d-block">{el.size}</span>
        </td>
        <td className="text-center">
          <span className="badge badge-warning">check pin</span>
        </td>
        <td className="text-right">
          <FileDownloader cid={el.cid}/>
  

          {/* <div className="d-flex align-items-center justify-content-end">
             <FontAwesomeIcon
              icon={['fas', 'info-circle']}
              className="font-size-sm opacity-5"
            />
             <FontAwesomeIcon
              icon={['fas', 'arrow-down']}
              className="font-size-sm opacity-5"
            />
             <FontAwesomeIcon
              icon={['fas', 'eraser']}
              className="font-size-sm opacity-5"
            />
          </div> */}
        </td>
      </tr>
    ))}
  </tbody>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;
