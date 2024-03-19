import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import Icon from 'components/Icon';
import appMessages from 'containers/App/messages';

import ButtonDefaultWithIcon from '../ButtonDefaultWithIcon';
import ButtonDefault from '../ButtonDefault';
import ButtonSubmit from '../ButtonSubmit';
import ButtonFlat from '../ButtonFlat';
import ButtonFlatWithIcon from '../ButtonFlatWithIcon';
import ButtonDefaultIconOnly from '../ButtonDefaultIconOnly';
import ButtonFlatIconOnly from '../ButtonFlatIconOnly';
import Bookmarker from '../../../containers/Bookmarker';

const ButtonFactory = ({ button, intl }) => {
  const { title } = button;
  switch (button.type) {
    case 'primary':
      return (
        <ButtonDefault
          onClick={button.onClick && (() => button.onClick())}
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title}
        >
          {title}
        </ButtonDefault>
      );
    case 'formPrimary':
      return (
        <ButtonSubmit
          onClick={button.onClick && (() => button.onClick())}
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title}
        >
          {title}
        </ButtonSubmit>
      );
    case 'add':
      return (
        <ButtonDefaultWithIcon
          onClick={() => button.onClick()}
          icon="add"
          strong
          type={button.submit ? 'submit' : 'button'}
          title={button.title || intl.formatMessage(appMessages.buttons.add)}
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
          title={title || intl.formatMessage(appMessages.buttons.add)}
          disabled={button.disabled}
          inForm
        />
      );
    case 'save':
      return (
        <ButtonFlat
          primary
          onClick={() => button.onClick()}
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title || intl.formatMessage(appMessages.buttons.save)}
        >
          {title || intl.formatMessage(appMessages.buttons.save)}
        </ButtonFlat>
      );
    case 'cancel':
      return (
        <ButtonFlat
          onClick={() => button.onClick()}
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title || intl.formatMessage(appMessages.buttons.cancel)}
        >
          {title || intl.formatMessage(appMessages.buttons.cancel)}
        </ButtonFlat>
      );
    case 'edit':
      return (
        <ButtonFlat
          onClick={() => button.onClick()}
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title || intl.formatMessage(appMessages.buttons.edit)}
        >
          {title || intl.formatMessage(appMessages.buttons.edit)}
        </ButtonFlat>
      );
    case 'close':
      return (
        <ButtonDefaultIconOnly
          onClick={() => button.onClick()}
          type={button.submit ? 'submit' : 'button'}
          title={title || intl.formatMessage(appMessages.buttons.close)}
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
          title={button.buttonTitle || title || intl.formatMessage(appMessages.buttons.close)}
          inForm
        >
          {title || intl.formatMessage(appMessages.buttons.close)}
        </ButtonFlat>
      );
    case 'textPrimary':
      return (
        <ButtonFlat
          onClick={button.onClick && (() => button.onClick())}
          primary
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title}
        >
          {title}
        </ButtonFlat>
      );
    case 'bookmarker':
      return <Bookmarker type={button.entityType} />;
    case 'download':
    case 'icon':
      return (
        <ButtonFlatIconOnly
          onClick={button.onClick && (() => button.onClick())}
          title={title}
          subtle
        >
          <Icon name={button.icon} />
        </ButtonFlatIconOnly>
      );
    case 'simple':
    case 'text':
    case 'delete':
    default:
      return (
        <ButtonFlat
          onClick={() => button.onClick()}
          type={button.submit ? 'submit' : 'button'}
          disabled={button.disabled}
          title={button.buttonTitle || title}
        >
          {title}
        </ButtonFlat>
      );
  }
};

ButtonFactory.propTypes = {
  button: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ButtonFactory);
