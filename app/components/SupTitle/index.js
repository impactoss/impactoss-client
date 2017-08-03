import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';

const Styled = styled.span`
  text-transform: uppercase;
  color: ${palette('dark', 3)};
  font-weight: bold;
  font-size: 0.85em;
`;

const SupIconWrap = styled.span`
  position: relative;
  top: -1px;
`;

class SupTitle extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { icon, title } = this.props;

    return (
      <Styled>
        { icon &&
          <SupIconWrap>
            <Icon name={icon} text textLeft />
          </SupIconWrap>
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
