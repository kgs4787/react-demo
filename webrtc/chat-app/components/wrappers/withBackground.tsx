import * as React from 'react';

type Props = {
  children?: React.ReactNode;
  router: { route: string };
  bgStyle: {};
};

const withBackground = (WrappedComponent: React.ComponentType<Props>) => {
  return class Background extends React.Component<Props> {
    render() {
      const { route } = this.props.router;
      const style = { background: '#9bbbd4', minHeight: '100%' };

      if (route === '/chat') {
        return <WrappedComponent {...this.props} bgStyle={style} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};

export default withBackground;
