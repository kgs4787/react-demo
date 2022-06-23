import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '../atoms/Button';
import IconButton from '../atoms/IconButton';
import Popover from '@material-ui/core/Popover';
import UserList from '../molecules/UserList';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { User } from '../../mobx/Chat';

export type Props = {
  user: User;
  users: Array<User>;
  room: string;
  classes: {
    space: string;
  };
  invites: Array<{ sender: { userId: string }; room: string; time: number }>;
  inviteRoom: (params: { sender: {}; receiver: {}; room: string }) => void;
  removeInvite: (params: {}) => void;
  moveRoom: (params: { type: 'join' | 'leave'; room: string }) => void;
  logout: () => void;
  toggleWindow: (params: {}) => void;
};

type State = {
  [key: string]: HTMLElement | null;
};

class CustomAppBar extends React.Component<Props, State> {
  state = {
    userListEl: null,
  };

  handleClick = (params: {
    e: React.MouseEvent<HTMLElement>;
    type: string;
  }) => {
    const { e, type } = params;
    this.setState({
      [type]: e.currentTarget,
    });
  };

  handleClose = (params: { type: string }) => {
    const { type } = params;
    this.setState({
      [type]: null,
    });
  };

  render() {
    const { user, users, room, classes, inviteRoom, toggleWindow } = this.props;
    const { userListEl } = this.state;

    return (
      <React.Fragment>
        <AppBar position="fixed">
          <Toolbar>
            <Typography
              variant="h6"
              color="inherit"
              style={{
                cursor: 'pointer',
              }}
            >
              Chat App
            </Typography>
            <div style={{ flexGrow: 1 }} />
            <IconButton
              user={user}
              color="inherit"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                this.handleClick({ e, type: 'userListEl' });
              }}
            >
              <Badge badgeContent={users.length} color="secondary">
                <AccountCircle />
              </Badge>
            </IconButton>
            <Popover
              id="simple-popper"
              open={Boolean(userListEl)}
              anchorEl={userListEl}
              onClose={() => {
                this.handleClose({ type: 'userListEl' });
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <UserList
                user={user}
                users={users}
                room={room}
                inviteRoom={inviteRoom}
                toggleWindow={toggleWindow}
              />
            </Popover>
            <Button user={user} color="inherit" onClick={this.props.logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.space} />
      </React.Fragment>
    );
  }
}

export default CustomAppBar;
