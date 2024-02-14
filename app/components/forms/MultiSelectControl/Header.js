import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonFactory from '../../buttons/ButtonFactory';

const Styled = styled.div`
  display: table;
  width: 100%;
  color: ${palette('multiSelectHeader', 0)};
  background-color: ${palette('multiSelectHeader', 1)};
  box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.2);
  border-bottom: 1px solid ${palette('primary', 4)};
  z-index: 1;
  height: 80px;
  padding: 16px;
  padding-left: 0.75em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    height: 80px;
    padding-left: 1em;
  }
`;

const Title = styled.div`
  font-size: 0.85em;
  display: table-cell;
  width: 99%;
  vertical-align: middle;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

const Header = (props) => (
  <Styled>
    <Title>
      {props.title}
    </Title>
    {props.onCancel
      && (
        <ButtonFactory button={{ onClick: props.onCancel, type: 'close' }} />
      )
    }
  </Styled>
);

Header.propTypes = {
  onCancel: PropTypes.func,
  title: PropTypes.string,
};
export default Header;
