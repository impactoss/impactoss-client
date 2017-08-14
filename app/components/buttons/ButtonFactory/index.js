import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import appMessages from 'containers/App/messages';

import ButtonDefaultWithIcon from '../ButtonDefaultWithIcon';
import ButtonDefault from '../ButtonDefault';
import ButtonSubmit from '../ButtonSubmit';
import ButtonFlat from '../ButtonFlat';
import ButtonFlatWithIcon from '../ButtonFlatWithIcon';
import ButtonDefaultIconOnly from '../ButtonDefaultIconOnly';

class ButtonFactory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { button } = this.props;
    switch (button.type) {
      case 'primary' :
        return (
          <ButtonDefault
            onClick={button.onClick && (() => button.onClick())}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
            {button.title}
          </ButtonDefault>
        );
      case 'formPrimary' :
        return (
          <ButtonSubmit
            onClick={button.onClick && (() => button.onClick())}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
            {button.title}
          </ButtonSubmit>
        );
      case 'add' :
        return (
          <ButtonDefaultWithIcon
            onClick={() => button.onClick()}
            icon="add"
            strong
            type={button.submit ? 'submit' : 'button'}
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.add)}
            disabled={button.disabled}
          />
        );
      case 'addFromMultiselect':
        return (
          <ButtonFlatWithIcon
            onClick={() => button.onClick()}
            icon="add"
            strong
            type={button.submit ? 'submit' : 'button'}
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.add)}
            disabled={button.disabled}
            form
          />
        );
      case 'save' :
        return (
          <ButtonFlat
            primary
            onClick={() => button.onClick()}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
            {button.title || this.context.intl.formatMessage(appMessages.buttons.save)}
          </ButtonFlat>
        );
      case 'cancel' :
        return (
          <ButtonFlat
            onClick={() => button.onClick()}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
            {button.title || this.context.intl.formatMessage(appMessages.buttons.cancel)}
          </ButtonFlat>
        );
      case 'edit' :
        return (
          <ButtonFlat
            onClick={() => button.onClick()}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
            {button.title || this.context.intl.formatMessage(appMessages.buttons.edit)}
          </ButtonFlat>
        );
      case 'close' :
        return (
          <ButtonDefaultIconOnly
            onClick={() => button.onClick()}
            type={button.submit ? 'submit' : 'button'}
            title={button.title || this.context.intl.formatMessage(appMessages.buttons.close)}
            disabled={button.disabled}
          >
            <Icon name="close" />
          </ButtonDefaultIconOnly>
        );
      case 'closeText':
        return (
          <ButtonFlat
            onClick={() => button.onClick()}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
            form
          >
            {button.title || this.context.intl.formatMessage(appMessages.buttons.close)}
          </ButtonFlat>
        );
      case 'textPrimary' :
        return (
          <ButtonFlat
            onClick={button.onClick && (() => button.onClick())}
            primary
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
            {button.title}
          </ButtonFlat>
        );
      case 'simple' :
      case 'text' :
      case 'delete' :
      default :
        return (
          <ButtonFlat
            onClick={() => button.onClick()}
            type={button.submit ? 'submit' : 'button'}
            disabled={button.disabled}
          >
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
