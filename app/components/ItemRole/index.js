import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const Status = styled.div`
  float: right;
  font-size: 13px;
  color: ${palette('dark', 4)};
  padding-left: 1em;
`;
// font-weight: bold;

class ItemRole extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { role } = this.props;
    return role
      ? (<Status>{role}</Status>)
      : null
    ;
  }
}

ItemRole.propTypes = {
  role: PropTypes.string,
};

export default ItemRole;
