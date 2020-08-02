import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';
 const mapStateToProps = state => {
  console.log(state.data);

  return { tableData: state.data.tableData };
};

const ConnectedList = ({ tableData }) => (
  <tbody>
    {tableData.map((el,index) => (
      <tr key={index}>
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

export default List;
