import React, { PropTypes } from 'react';

import Icon from 'components/Icon';
import appMessages from 'containers/App/messages';

import ButtonPrimaryIcon from '../ButtonPrimaryIcon';
import ButtonPrimary from '../ButtonPrimary';
import ButtonText from '../ButtonText';
import ButtonIconPrimary from '../ButtonIconPrimary';

class ButtonFactory extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { button } = this.props;

    switch (button.type) {
      case 'primary' :
        return (
          <ButtonPrimary onClick={() => button.onClick()}>
            {button.title}
          </ButtonPrimary>
        );
      case 'add' :
        return (
          <ButtonPrimaryIcon
            onClick={() => button.onClick()}
            icon="add"
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.add)}
          />
        );
      case 'edit' :
        return (
          <ButtonText onClick={() => button.onClick()}>
            {button.title || this.context.intl.formatMessage(appMessages.buttons.edit)}
          </ButtonText>
        );
      case 'close' :
        return (
          <ButtonIconPrimary
            onClick={() => button.onClick()}
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.close)}
          >
            <Icon name="close" />
          </ButtonIconPrimary>
        );
      case 'textPrimary' :
        return (
          <ButtonText onClick={() => button.onClick()} primary>
            {button.title}
          </ButtonText>
        );
      case 'text' :
      default :
        return (
          <ButtonText onClick={() => button.onClick()}>
            {button.title}
          </ButtonText>
        );
    }
  }

}
ButtonFactory.propTypes = {
  button: PropTypes.object.isRequired,
};
ButtonFactory.contextTypes = {
  intl: React.PropTypes.object.isRequired,
};

export default ButtonFactory;
