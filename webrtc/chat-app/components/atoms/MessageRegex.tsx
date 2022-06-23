import * as React from 'react';

type Props = {
  msg: string;
  types: Array<string>;
};

type State = {
  regexs: {
    [key: string]: {
      regex: RegExp;
      html: string;
    };
  };
};

class MessageRegex extends React.Component<Props, State> {
  state: State = {
    regexs: {
      url: {
        regex:
          /((\w+:\/\/)[-a-zA-Z0-9:@;?&=\/%\+\.\*!'\(\),\$_\{\}\^~\[\]`#|]+)/g,
        html: '<a href="$&" target="_blank">$&</a>',
      },
      email: {
        regex: /([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}/gim,
        html: '<a href="mailto:$&">$&</a>',
      },
    },
  };

  render() {
    const { msg, types } = this.props;
    const { regexs } = this.state;
    let replaceMsg = msg;

    types.forEach((type) => {
      replaceMsg = replaceMsg.replace(regexs[type].regex, regexs[type].html);
    });

    return <span dangerouslySetInnerHTML={{ __html: replaceMsg }} />;
  }
}

export default MessageRegex;
