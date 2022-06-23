import * as React from 'react';

export type Props = {
  user: {
    userId: string;
    socketId: string;
  };
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  color: 'inherit' | 'primary' | 'secondary' | 'default' | undefined;
};

const withAuth = (WrappedComponent: React.ComponentType<Props>) => {
  return class Auth extends React.Component<Props> {
    render() {
      const { user } = this.props;

      if (user.userId) {
        return <WrappedComponent {...this.props} />;
      }

      return null;
    }
  };
};

export default withAuth;
