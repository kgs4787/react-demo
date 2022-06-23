import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export type Props = {
  sendMessage: (params: {
    type: string;
    message: string;
    images: Array<{}>;
    receiver?: {};
  }) => void;
  classes: {
    inputContainer: string;
    input: string;
    buttonContainer: string;
    button: string;
  };
  receiver?: {};
};

class MessageField extends React.Component<Props> {
  state = {
    message: '',
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      message: e.target.value,
    });
  };

  sendMessage = () => {
    const { message } = this.state;
    const { receiver } = this.props;

    if (!message.trim()) {
      return;
    }

    this.props.sendMessage({ type: 'text', message, images: [], receiver });
    this.setState({
      message: '',
    });
  };

  handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      this.sendMessage();
    }
  };

  render() {
    const { classes } = this.props;
    const { message } = this.state;

    return (
      <React.Fragment>
        <div className={classes.inputContainer}>
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            multiline={true}
            className={classes.input}
            value={message}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            autoFocus={true}
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            className={classes.button}
            onClick={this.sendMessage}
          >
            SEND
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default MessageField;
