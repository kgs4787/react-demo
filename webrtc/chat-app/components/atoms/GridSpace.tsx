import * as React from 'react';
import Grid from '@material-ui/core/Grid';

export type Props = {
  hasSpace: boolean;
  xs:
    | boolean
    | 'auto'
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | undefined;
};

class GridSpace extends React.Component<Props> {
  render() {
    const { hasSpace, xs } = this.props;

    if (hasSpace) {
      return <Grid item xs={xs} />;
    }

    return null;
  }
}

export default GridSpace;
