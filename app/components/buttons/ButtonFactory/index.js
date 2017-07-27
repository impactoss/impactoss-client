import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import appMessages from 'containers/App/messages';

import ButtonDefaultWithIcon from '../ButtonDefaultWithIcon';
import ButtonDefault from '../ButtonDefault';
import ButtonFlat from '../ButtonFlat';
import ButtonDefaultIconOnly from '../ButtonDefaultIconOnly';

class ButtonFactory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { button } = this.props;

    switch (button.type) {
      case 'primary' :
        return (
          <ButtonDefault onClick={() => button.onClick()}>
            {button.title}
          </ButtonDefault>
        );
      case 'add' :
        return (
          <ButtonDefaultWithIcon
            onClick={() => button.onClick()}
            icon="add"
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.add)}
          />
        );
      case 'save' :
        return (
          <ButtonFlat primary onClick={() => button.onClick()}>
            {button.title || this.context.intl.formatMessage(appMessages.buttons.save)}
          </ButtonFlat>
        );
      case 'cancel' :
        return (
          <ButtonFlat onClick={() => button.onClick()}>
            {button.title || this.context.intl.formatMessage(appMessages.buttons.cancel)}
          </ButtonFlat>
        );
      case 'edit' :
        return (
          <ButtonFlat onClick={() => button.onClick()}>
            {button.title || this.context.intl.formatMessage(appMessages.buttons.edit)}
          </ButtonFlat>
        );
      case 'close' :
        return (
          <ButtonDefaultIconOnly
            onClick={() => button.onClick()}
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.close)}
          >
            <Icon name="close" />
          </ButtonDefaultIconOnly>
        );
      case 'textPrimary' :
        return (
          <ButtonFlat onClick={() => button.onClick()} primary>
            {button.title}
          </ButtonFlat>
        );
      case 'text' :
      case 'delete' :
      default :
        return (
          <ButtonFlat onClick={() => button.onClick()}>
            {button.title}
          </ButtonFlat>
        );
    }
  }

}
ButtonFactory.propTypes = {
  button: PropTypes.object.isRequired,
};
ButtonFactory.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default ButtonFactory;
