import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

import IconButton from '@material-ui/core/IconButton';

import SearchIcon from '@material-ui/icons/SwapVert';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

export default function FetchComponent(props) {
  const classes = useStyles();
  const [cid, setCid] = useState("");
  console.log(props, 'props');

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        value={cid}
        onChange={e => setCid(e.target.value)}
        placeholder="Fetch data by CID"
        inputProps={{ 'aria-label': 'CID' }}
      />
      <IconButton
        onClick={() => props.handleFetch(cid)}
        className={classes.iconButton}
        aria-label="Fetchs">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
