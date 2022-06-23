import * as React from 'react';
import Button from '@material-ui/core/Button';
import withAuth, { Props } from '../wrappers/withAuth';

class CustomButton extends React.Component<Props> {
  render() {
    const { children, onClick, color } = this.props;
    return (
      <Button color={color} onClick={onClick}>
        {children}
      </Button>
    );
  }
}

export default withAuth(CustomButton);
