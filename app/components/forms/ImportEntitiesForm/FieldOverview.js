import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';
import {
  Text,
  Box,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionPanel,
} from 'grommet';

import AccordionHeader from 'components/AccordionHeader';

import messages from './messages';

const StyledAccordion = styled(Accordion)`
  button {
  box-shadow: unset;
  border-color: unset;
  outline: unset;
  &:focus-visible{
    outline: 2px solid ${palette('primary', 0)};
    outline-offset: 0px;
    }
  }
`;

const FieldOverview = ({ data, intl }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Box margin="medium">
      <StyledAccordion
        onActive={(actives) => {
          // check for active indices (with only one panel, it will always be 0)
          setOpen(actives && actives.indexOf(0) > -1);
        }}
        animate={false}
      >
        <AccordionPanel
          header={(
            <AccordionHeader
              title={isOpen
                ? intl.formatMessage(messages.hideFieldOverview)
                : intl.formatMessage(messages.showFieldOverview)
              }
              open={isOpen}
            />
          )}
        >
          <Box
            background="light-1"
            pad="medium"
            margin={{
              top: '2px', // for focus-visible outline on panel header
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell scope="col" border="bottom">
                    <Text size="xsmall" weight={600}>
                      <FormattedMessage {...messages.fieldOverviewColumn} />
                    </Text>
                  </TableCell>
                  <TableCell scope="col" border="bottom">
                    <Text size="xsmall" weight={600}>
                      <FormattedMessage {...messages.fieldOverviewInfo} />
                    </Text>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && Object.keys(data).filter((d) => d.trim() !== '').map(
                  (d, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row">
                        <Text size="xsmall">{d}</Text>
                      </TableCell>
                      <TableCell>
                        <Text size="xsmall">{data[d]}</Text>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </AccordionPanel>
      </StyledAccordion>
    </Box>
  );
};

FieldOverview.propTypes = {
  data: PropTypes.object,
  intl: intlShape,
};

export default injectIntl(FieldOverview);
