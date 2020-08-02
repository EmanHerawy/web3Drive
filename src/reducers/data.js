// Sidebar

export const ADD_NEW_ROW = 'ADD_NEW_ROW';
export const INIT_IPFS = 'INIT_IPFS';
export const REMOVE_ROW = 'REMOVE_ROW';

export const addNewRow = row => ({
  type: ADD_NEW_ROW,
  row
});
export const initIPFS = node => ({
  type: INIT_IPFS,
  node
});
export const removeRow = cid => ({
  type: REMOVE_ROW,
  cid
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
    case REMOVE_ROW:
      return {
        ...state,
        tableData: state.tableData.filter(item => item.cid !== action.cid)
      };

    default:
      break;
  }
  return state;
}
