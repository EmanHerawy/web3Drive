// src/js/components/Form.jsx
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addNewRow } from '../../../../../reducers/data';
import { getTableData } from '../../../../../utils/helper';

function mapDispatchToProps(dispatch) {
  return {
    addNewRow: node => dispatch(addNewRow(node))
  };
}

class TableDataLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: []
    };
  }

  componentDidMount() {
    this.getTableData().then(() => {
      const { dataTable } = this.state;
      dataTable.map(data => {
        this.props.addNewRow({
          cid: data.cid,
          name: data.name,
          size: data.size,
          key: data.key
        });
      });
    });
  }
  async getTableData() {
    this.state.dataTable = await getTableData();
  }
  render() {
    return <span> </span>;
  }
}

const LoadTableData = connect(null, mapDispatchToProps)(TableDataLoader);

export default LoadTableData;
