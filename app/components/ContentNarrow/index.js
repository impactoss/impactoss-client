import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box } from 'grommet';

import Content from 'components/Content';
import Row from 'components/styled/Row';


const RowStyled = styled(Row)`
  margin: 0;
  display: flex;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-right: -${(props) => props.theme.gutter}px;
    margin-left: -${(props) => props.theme.gutter}px;
  }
`;
const GridSpace = styled((p) => <Box {...p} />)`
  @media (min-width: 0px) {
    display: none !important;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    display: inline-block !important;
    flex-basis: 25%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    display: inline-block !important;
    flex-basis: 33%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    display: inline-block !important;
    flex-basis: 33%;
  }
`;
const GridMain = styled((p) => <Box {...p} />)`
  padding-right: 0 !important;
  padding-left: 0 !important;
  @media (min-width: 0px) {
    flex-basis: 100%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    padding-right: ${({ theme }) => theme.gutter}px !important;
    padding-left: ${({ theme }) => theme.gutter}px !important;
    flex-basis: 50%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    flex-basis: 40%;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.large}) {
    flex-basis: 33%;
  }
`;

const ContentNarrow = ({ children }) => (
  <Content>
    <RowStyled>
      <GridSpace />
      <GridMain>
        {children}
      </GridMain>
    </RowStyled>
  </Content>
);

ContentNarrow.propTypes = {
  children: PropTypes.node,
};

export default ContentNarrow;
