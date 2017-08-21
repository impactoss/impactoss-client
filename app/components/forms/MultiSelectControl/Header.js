import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Close from './Close';

const Styled = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${palette('dark', 2)};
  color: ${palette('primary', 4)};
  height: 60px;
  padding: 1em 0 1em 1em;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  z-index: 1;
`;

const Header = (props) => (
  <Styled>
    { props.title }
    { props.onCancel &&
      <Close onCancel={props.onCancel} />
    }
  </Styled>
);

Header.propTypes = {
  onCancel: PropTypes.func,
  title: PropTypes.string,
};
export default Header;
