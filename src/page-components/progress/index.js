import React, { Fragment } from 'react';

import { LinearProgress } from '@material-ui/core';

export default function Progress() {
  const [completed, setCompleted] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const _progress = React.useRef(() => {});
  React.useEffect(() => {
    _progress.current = () => {
      if (completed > 100) {
        setCompleted(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setCompleted(completed + diff);
        setBuffer(completed + diff + diff2);
      }
    };
  });



  return (
    <Fragment>
        <LinearProgress
        variant="buffer"
        value={completed}
        valueBuffer={buffer}
        className="mb-4"
        color="secondary"
      />

    </Fragment>
  );
}
