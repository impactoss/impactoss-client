import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { injectIntl } from 'react-intl';

import Label from 'components/styled/Label';
import qe from 'utils/quasi-equals';
import appMessage from 'utils/app-message';

import messages from './messages';

const Status = styled(Label)`
  float: ${({ float }) => float || 'right'};
  padding-left: ${({ float }) => float === 'left' ? 0 : '1em'};
  padding-right: ${({ float }) => float === 'left' ? '1em' : 0};
  font-weight: bold;
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.listItemTop};
  margin-top: ${({ top }) => top ? '-7px' : 0};
  color: ${palette('dark', 4)};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.listItemTop};
  }
`;

class ItemStatus extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
     
      draft, // deprecated
      top,
      float,
      entity,
      attribute,
      options,
      value,
      intl,
    } = this.props;

    if (draft) {
      return (
        <Status top={top} float={float}>
          {intl && intl.formatMessage(messages.draft)}
        </Status>
      );
    }
    const val = typeof value === 'undefined'
      ? entity[attribute]
      : value;
    const option = options.find((o) => qe(o.value, val));
    return (
      <Status top={top} float={float}>
        {option
          && option.message
          && intl
          && appMessage(intl, option.message)}
      </Status>
    );
  }
}

ItemStatus.propTypes = {
  draft: PropTypes.bool,
  top: PropTypes.bool,
  float: PropTypes.string,
  attribute: PropTypes.string,
  value: PropTypes.string,
  entity: PropTypes.object,
  options: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(ItemStatus);
