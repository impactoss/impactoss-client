import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { injectIntl, intlShape } from 'react-intl';

import appMessage from 'utils/app-message';

const Status = styled.div`
  float: right;
  padding-left: 5px;
  text-transform: uppercase;
  font-weight: 600;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    padding-left: 13px;
  }
`;

class ItemSupport extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { supportLevel, intl } = this.props;
    return supportLevel
      ? (
        <Status>
          {appMessage(intl, supportLevel.message)}
        </Status>
      )
      : null;
  }
}

ItemSupport.propTypes = {
  supportLevel: PropTypes.object,
  intl: intlShape,
};

export default injectIntl(ItemSupport);
