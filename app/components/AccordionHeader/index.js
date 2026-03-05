import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
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

const StyledText = styled((p) => (
  <Text {...p} />
))`
  font-weight: ${({ level }) => level === 1 ? 500 : 400};
`;

function AccordionHeader({ title, open, level = 1 }) {
  // prettier-ignore
  return (
    <StyledBox>
      <Box
        margin={{ vertical: 'xsmall' }}
      >
        <StyledText level={level}>
          {title}
        </StyledText>
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
