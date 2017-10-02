import { get } from 'lodash/object';
import appMessages from 'containers/App/messages';

export default function appMessage(intlContext, messageKey) {
  if (get(appMessages, messageKey)) {
    return intlContext
      ? intlContext.formatMessage(get(appMessages, messageKey))
      : get(appMessages, messageKey).defaultMessage;
  }
  return `'${messageKey}' not found. `;
}
