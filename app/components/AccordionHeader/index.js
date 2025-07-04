import React from 'react';
import PropTypes from 'prop-types';
import { Box, Heading, Text } from 'grommet';
import { Up, Down } from 'grommet-icons';
import styled from 'styled-components';

import PrintHide from 'components/styled/PrintHide';
import PrintOnly from 'components/styled/PrintOnly';

const StyledBox = styled((p) => (
  <Box
    direction="row"
    gap="small"
    align="center"
    pad={{ vertical: 'small', left: 'xxsmall', right: 'xsmall' }}
    {...p}
  />
))`
  border-bottom: 1px solid;
`;

function AccordionHeader({ title, open, level = 1 }) {
  // prettier-ignore
  return (
    <StyledBox>
      <Box>
        <Heading
          responsive={false}
          level={6}
          margin={{ vertical: 'xsmall' }}
          style={level === 2 ? { fontWeight: 400 } : {}}
        >
          {title}
        </Heading>
      </Box>
      <Box margin={{ left: 'auto' }}>
        <PrintHide>
          {!open && <Down size="small" />}
          {open && <Up size="small" />}
        </PrintHide>
        <PrintOnly>
          {!open && <Text size="xsmall">(hidden)</Text>}
        </PrintOnly>
      </Box>
    </StyledBox>
  );
}

AccordionHeader.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  level: PropTypes.number,
};

export default AccordionHeader;
