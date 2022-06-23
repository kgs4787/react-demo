import * as React from 'react';
import Message from '../molecules/Message';
import Grid from '@material-ui/core/Grid';
import { Element } from 'react-scroll';

type Props = {
  messages: Array<{
    type: string;
    message: string;
    user: {
      userId: string;
      socketId: string;
    };
    images: [];
  }>;
  myself: { userId: string; socketId: string };
  id?: string;
};

class Messages extends React.Component<Props> {
  render() {
    const { messages, myself, id } = this.props;

    return (
      <Grid
        container
        style={{
          overflow: 'hidden auto',
        }}
        id={id}
      >
        {messages.map((message, i) => (
          <Message key={i} {...message} myself={myself} />
        ))}
        <Element name={'window'} />
      </Grid>
    );
  }
}

export default Messages;
