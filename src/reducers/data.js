// Sidebar

export const ADD_NEW_ROW = 'ADD_NEW_ROW';
export const INIT_IPFS = 'INIT_IPFS';
export const GET_TABLE_DATA = 'GET_TABLE_DATA';

export const addNewRow = row => ({
  type: ADD_NEW_ROW,
  row
});
export const initIPFS = node => ({
  type: INIT_IPFS,
  node
});
export const getRows = () => ({
  type: GET_TABLE_DATA
});
const tableRow = {
  cid: 'sjhfksjdhf',
  name: 'test',
  size: 0,
  key: 'sjdcsjfhjsfd'
};

export default function reducer(
  state = {
    // table
    tableData: [],
    node: {}
  },
  action
) {
  switch (action.type) {
    // Sidebar

    case ADD_NEW_ROW:
      return Object.assign({}, state, {
        tableData: state.tableData.concat(action.row)
      });
    case INIT_IPFS:
      console.log(action, 'action.payload');

      return {
        ...state,
        node: action.node
      };
    case GET_TABLE_DATA:
      return state.tableData;

    default:
      break;
  }
  return state;
}
