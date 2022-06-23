import * as React from 'react';
import Head from 'next/head';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '../organisms/AppBar';
import { observer, inject } from 'mobx-react';
import * as Routes from '../../lib/routes';
import { Theme, createStyles } from '@material-ui/core';
import withBackground from '../wrappers/withBackground';
import { User } from '../../mobx/Chat';
import ChatWindow from '../organisms/ChatWindow';
import Paper from '@material-ui/core/Paper';
import InputArea from '../organisms/InputArea';
import Messages from '../organisms/Messages';
import { scroller } from 'react-scroll';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing.unit * 2,
      overflow: 'hidden',
    },
    space: {
      ...theme.mixins.toolbar,
      marginBottom: 10,
    },
    paper: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    },
    window: {
      margin: '5px 0',
      padding: theme.spacing.unit,
      boxSizing: 'border-box',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  });

type Props = {
  chat: {
    user: User;
    users: Array<User>;
    invites: Array<{ sender: { userId: string }; room: string; time: number }>;
    socket: {
      on: (type: string, callback: (res: any) => void) => void;
      emit: (type: string, req?: {}) => void;
    };
    setUser: (user: {}) => void;
    setUsers: (users: Array<{}>) => void;
    setInvites: (params: {}) => void;
    removeInvites: (params: {}) => void;
    toggleWindow: (params: {}) => void;
    setWindow: (params: {}) => void;
    updateWindow: (params: {}) => void;
    removeWindow: (params: {}) => void;
    setWindowMessage: (params: {}) => void;
  };
  classes: {
    root: string;
    space: string;
    window: string;
  };
  router: {
    route: string;
    query: {
      room: string;
    };
  };
  bgStyle: {};
};

const withMain = (Page: any) => {
  @inject('chat')
  @observer
  class MainWrapper extends React.Component<Props> {
    static async getInitialProps(ctx: {}) {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(ctx) : null),
      };
    }

    componentDidMount() {
      const { chat } = this.props;
      const { user, socket } = chat;

      if (!user.userId || !user.socketId) {
        Routes.Router.pushRoute('/');
      }

      if (socket) {
        socket.on('logout', () => {
          Routes.Router.pushRoute('/');
          (document.location as Location).replace('/');
        });

        socket.on('updateUsers', ({ users }) => {
          chat.setUsers(users);
        });

        socket.on('inviteRoom', (data) => {
          chat.setInvites(data);
        });

        socket.on('setWindow', ({ user }) => {
          chat.setWindow(user);
        });

        socket.on('updateWindow', ({ user }) => {
          chat.updateWindow(user);
        });

        socket.on('removeWindow', ({ user }) => {
          chat.removeWindow(user);
        });

        socket.on('chatWindow', ({ sender, type, message, images, time }) => {
          const window = chat.user.windows.find(
            (window) => window.receiver.socketId === sender.socketId
          ) || { open: false };

          chat.setWindowMessage({
            user: sender,
            receiver: sender,
            type,
            message,
            images,
            time,
          });

          if (window.open) {
            scroller.scrollTo('window', {
              smooth: true,
              containerId: sender.socketId,
            });
          }
        });
      }
    }

    logout = () => {
      const { socket, user } = this.props.chat;
      socket.emit('logout', { user });
    };

    sendMessage = (params: {
      type: string;
      message: string;
      images: Array<{}>;
      receiver?: { socketId: string };
    }) => {
      const {
        type,
        message = '',
        images = [],
        receiver = { socketId: '' },
      } = params;
      const { chat } = this.props;
      const { socket, user } = chat;
      const time = new Date().getTime();

      socket.emit('chatWindow', {
        sender: {
          userId: user.userId,
          socketId: user.socketId,
        },
        receiver,
        type,
        message,
        images,
      });

      chat.setWindowMessage({
        user: {
          userId: user.userId,
          socketId: user.socketId,
        },
        receiver,
        type,
        message,
        images,
        time,
      });

      scroller.scrollTo('window', {
        smooth: true,
        containerId: receiver.socketId,
      });
    };

    render() {
      const { classes, router, chat, bgStyle } = this.props;
      const { user, users, invites, toggleWindow } = chat;

      return (
        <div style={{ ...bgStyle }}>
          <Head>
            <title>Chat App</title>
          </Head>
          <AppBar
            user={user}
            users={users}
            invites={invites}
            classes={classes}
            room={router.query.room}
            logout={this.logout}
            inviteRoom={this.inviteRoom}
            removeInvite={this.removeInvite}
            moveRoom={this.moveRoom}
            toggleWindow={toggleWindow}
          />
          <div className={classes.root}>
            <Page {...this.props} classes={classes} />
          </div>
          {user.windows.map((window, i) => (
            <ChatWindow
              key={i}
              zIndex={1200}
              width={300}
              height={300}
              position={'center'}
              direction={'top'}
              resize={true}
              open={window.open}
              receiver={window.receiver}
              onClose={() => {
                toggleWindow({ receiver: window.receiver, open: false });
              }}
            >
              <Paper className={classes.window} elevation={1}>
                <Messages
                  messages={window.messages}
                  myself={user}
                  id={window.receiver.socketId}
                />
                <InputArea
                  receiver={window.receiver}
                  style={{
                    position: 'relative',
                    padding: '0 16px',
                    maxHeight: 100,
                  }}
                  sendMessage={this.sendMessage}
                />
              </Paper>
            </ChatWindow>
          ))}
        </div>
      );
    }
  }

  return withStyles(styles, { name: 'MainWrapper' })(
    withBackground(MainWrapper as any)
  );
};

export default withMain;
