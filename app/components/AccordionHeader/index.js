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

const StyledHeading = styled((p) => (
  <Heading {...p} />
))`
  font-size: 1.1em;
  line-height: 1.1em;
  margin: 0;
`;

function AccordionHeader({ title, open, level = 1 }) {
  // prettier-ignore
  return (
    <StyledBox>
      <Box>
        <StyledHeading
          responsive={false}
          level={2}
          margin={{ vertical: 'xsmall' }}
          style={level === 2 ? { fontWeight: 400 } : {}}
        >
          {title}
        </StyledHeading>
      </Box>
      <Box margin={{ left: 'auto' }}>
        <PrintHide>
          {!open && <Down aria-hidden="true" aria-label={null} size="small" />}
          {open && <Up aria-hidden="true" aria-label={null} size="small" />}
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
