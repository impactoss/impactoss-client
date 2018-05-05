import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Grid from 'grid-styled';

import Content from 'components/Content';
import Row from 'components/styled/Row';


const RowStyled = styled(Row)`
  margin: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-right: -${(props) => props.theme.gutter}px;
    margin-left: -${(props) => props.theme.gutter}px;
  }
`;
const GridSpace = styled(Grid)`
  display: none !important;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block !important;
  }
`;
const GridMain = styled(Grid)`
  padding-right: 0 !important;
  padding-left: 0 !important;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding-right: ${(props) => props.theme.gutter}px !important;
    padding-left: ${(props) => props.theme.gutter}px !important;
  }
`;

class ContentNarrow extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Content>
        <RowStyled>
          <GridSpace lg={1 / 3} md={3 / 10} sm={1 / 4} />
          <GridMain lg={1 / 3} md={2 / 5} sm={1 / 2} xs={1}>
            {this.props.children}
          </GridMain>
        </RowStyled>
      </Content>
    );
  }
}

ContentNarrow.propTypes = {
  children: PropTypes.node,
};

export default ContentNarrow;
