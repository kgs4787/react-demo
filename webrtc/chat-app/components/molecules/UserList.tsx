import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import WindowButton from '../atoms/WindowButton';
import { User } from '../../mobx/Chat';

export type Props = {
  user: User;
  users: Array<User>;
  room: string;
  inviteRoom: (params: { sender: {}; receiver: {}; room: string }) => void;
  toggleWindow: (params: {}) => void;
};

class UserList extends React.Component<Props> {
  render() {
    const { users, room, inviteRoom, toggleWindow } = this.props;
    const myself = this.props.user;

    return (
      <Paper>
        <List style={{ maxWidth: '100%', maxHeight: 300, overflow: 'auto' }}>
          {users.map((user, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={user.userId}
                primaryTypographyProps={{
                  variant: 'button',
                  color: 'textPrimary',
                  noWrap: true,
                }}
                secondary={myself.socketId === user.socketId ? '사용자' : ''}
              />
              <WindowButton
                myself={myself}
                user={user}
                onClick={() => {
                  toggleWindow({ receiver: user, open: true });
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}

export default UserList;
