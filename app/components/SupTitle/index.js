import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

const Styled = styled.span`
  text-transform: uppercase;
  color: ${palette('text', 1)};
  font-weight: bold;
  font-size: 0.85em;
  letter-spacing: 0.75px;
  display: inline-block;
`;

class SupTitle extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { icon, title } = this.props;

    return (
      <Styled>
        { icon &&
          <Icon name={icon} text textLeft />
        }
        { title }
      </Styled>
    );
  }
}

SupTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

export default SupTitle;
