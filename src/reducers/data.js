// Sidebar
export const ADD_NEW_ROW = 'ADD_NEW_ROW';
export const UPDATE_ROW = 'UPDATE_ROW';
export const INIT_IPFS = 'INIT_IPFS';
export const INIT_IDENTITY = 'INIT_IDENTITY';
export const REMOVE_ROW = 'REMOVE_ROW';
export const REST = 'REST';
export const GET_ROW = 'GET_ROW';
export const ADD_TO_3BOX = 'ADD_TO_3BOX';

export const addNewRow = row => ({
  type: ADD_NEW_ROW,
  row
});
export const initIdentity = identity => ({
  type: INIT_IDENTITY,
  identity
});
export const rest = () => ({
  type: REST

});
export const addTo3Box = row => ({
  type: ADD_TO_3BOX,
  row
});
export const initIPFS = node => ({
  type: INIT_IPFS,
  node
});
export const getRow = cid => ({
  type: GET_ROW,
  cid
});
export const updateRow = row => ({
  type: UPDATE_ROW,
  row
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
    boxFiles: [],
    identity: null,
    space: null,
    FILES: [],
    node: {}
  },
  action
) {
  switch (action.type) {
    // Sidebar

    case ADD_TO_3BOX:
      return Object.assign({}, state, {
        boxFiles: action.row
      });
    case REST:
      return Object.assign({}, state, {
        boxFiles: {},
        tableData: [],
        FILES: []
      });
    case ADD_NEW_ROW:
      return Object.assign({}, state, {
        tableData: state.tableData.concat(action.row),
        FILES: state.FILES.concat(action.row.cid)
      });
    case INIT_IPFS:
      console.log(action, 'action.payload');

      return {
        ...state,
        node: action.node
      };
    case INIT_IDENTITY:
      console.log(action, 'action.payload');

      return {
        ...state,
        identity: action.identity.identity,
          boxFiles: action.identity.boxFiles,
          space: action.identity.space ? action.identity.space : {}
      };
    case REMOVE_ROW:
      return {
        ...state,
        tableData: state.tableData.filter(item => item.cid !== action.cid),
          FILES: state.FILES.filter(item => item !== action.cid)
      };
    case UPDATE_ROW:
      // console.log(action, state, 'action.row');

      return {
        ...state,
        tableData: state.tableData.map(row =>
          row.cid === action.row.cid ? action.row : row
        )
      };
    case GET_ROW:
      console.log(action, 'action');

      return state.tableData.filter(item => item.cid == action.cid);

    default:
      break;
  }
  return state;
}
