import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Box } from 'grommet';

import Content from 'components/Content';

const Wrapper = styled((p) => <Box {...p} />)`
    max-width: 90%;
    @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
      width: 100%;
      max-width: 400px;
    }
    @media (min-width: ${(props) => props.theme.breakpoints.large}) {
      max-width: 480px;
    }
`;


const ContentNarrow = ({ children }) => (
  <Content>
    <Box align="center" fill="horizontal">
      <Wrapper>
        {children}
      </Wrapper>
    </Box>
  </Content>
);

ContentNarrow.propTypes = {
  children: PropTypes.node,
};

export default ContentNarrow;
