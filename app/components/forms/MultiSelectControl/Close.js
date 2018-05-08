import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

const Styled = styled(Button)`
  position: absolute;
  right:0;
  top:0;
  color: ${palette('link', 3)};
  &:hover {
    color: ${palette('linkHover', 3)};
  }
`;

const Close = (props) => (
  <Styled onClick={props.onCancel} >
    <Icon name="close" sizes={{ mobile: '2em' }} />
  </Styled>
);

Close.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default Close;
