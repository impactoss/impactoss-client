import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import appMessage from 'utils/app-message';

import Label from 'components/styled/Label';
import { find } from 'lodash/collection';

import { USER_ROLES } from 'themes/config';

const Role = styled(Label)`
  float: right;
  padding-left: 1em;
  font-size: ${(props) => props.theme.sizes.text.smaller};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

class ItemRole extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { intl } = this.context;
    const role = this.props.role && parseInt(this.props.role, 10) !== USER_ROLES.DEFAULT.value
      && find(USER_ROLES, { value: parseInt(this.props.role, 10) });

    return role
      ? (
        <Role>
          { role && role.message
            ? appMessage(intl, role.message)
            : ((role && role.label) || this.props.role)
          }
        </Role>
      )
      : null;
  }
}

ItemRole.propTypes = {
  role: PropTypes.number,
};

export default ItemRole;
