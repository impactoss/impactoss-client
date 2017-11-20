import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Close from './Close';

const Styled = styled.div`
  display: table;
  width: 100%;
  color: ${palette('multiSelectHeader', 0)};
  background-color: ${palette('multiSelectHeader', 1)};
  height: 60px;
  padding-left: 1em;
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  z-index: 1;
`;

const Title = styled.div`
  font-size: 0.85em;
  display: table-cell;
  width: 99%;
  vertical-align: middle;
`;
const CloseWrap = styled.div`
  display: table-cell;
  width: 48px;
  vertical-align: middle;
`;

const Header = (props) => (
  <Styled>
    <Title>
      { props.title }
    </Title>
    { props.onCancel &&
      <CloseWrap>
        <Close onCancel={props.onCancel} />
      </CloseWrap>
    }
  </Styled>
);

Header.propTypes = {
  onCancel: PropTypes.func,
  title: PropTypes.string,
};
export default Header;
