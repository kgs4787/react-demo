import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MessageField from '../molecules/MessageField';
import { NativeFiles } from 'react-dnd-component';
import Fade from '@material-ui/core/Fade';
import ImageField from '../molecules/ImageField';
import { Theme, createStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      top: 'auto',
      position: 'fixed',
      left: 0,
      bottom: 0,
      padding: theme.spacing.unit * 2,
      background: theme.palette.secondary.main,
      display: 'flex',
    },
    inputContainer: {
      flexGrow: 1,
      alignItems: 'center',
    },
    input: {
      background: theme.palette.common.white,
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      margin: theme.spacing.unit,
    },
    paper: {
      padding: theme.spacing.unit,
      minHeight: 100,
      maxHeight: 500,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      overflowY: 'scroll',
    },
    active: {
      background: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
  });

export type Props = {
  receiver?: {};
  classes: {
    root: string;
    inputContainer: string;
    input: string;
    buttonContainer: string;
    button: string;
  };
  style?: {};
  sendMessage: (params: {
    type: string;
    message: string;
    images: Array<{}>;
  }) => void;
};

class InputArea extends React.Component<Props> {
  render() {
    const { classes, style } = this.props;

    return (
      <NativeFiles>
        {(props) => {
          const { canDrop, files } = props;

          if (canDrop || files.length) {
            return (
              <div color="secondary" className={classes.root} style={style}>
                <ImageField {...this.props} {...props} />
              </div>
            );
          }

          return (
            <Fade in={!canDrop}>
              <div color="secondary" className={classes.root} style={style}>
                <MessageField {...this.props} />
              </div>
            </Fade>
          );
        }}
      </NativeFiles>
    );
  }
}

export default withStyles(styles, { name: 'InputArea' })(InputArea);
