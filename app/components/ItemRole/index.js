import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessage from 'utils/app-message';

import { find } from 'lodash/collection';

import { USER_ROLES } from 'themes/config';

const Status = styled.div`
  float: right;
  font-size: 0.8em;
  color: ${palette('dark', 4)};
  padding-left: 1em;
`;
// font-weight: bold;

class ItemRole extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const role = this.props.role && parseInt(this.props.role, 10) !== USER_ROLES.DEFAULT.value
      && find(USER_ROLES, { value: parseInt(this.props.role, 10) });

    return role
      ? (<Status>
        { role && role.message
          ? appMessage(this.context.intl, role.message)
          : ((role && role.label) || this.props.role)
        }
      </Status>)
      : null
    ;
  }
}

ItemRole.propTypes = {
  role: PropTypes.number,
};

export default ItemRole;
