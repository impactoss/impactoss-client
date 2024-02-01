/*
 *
 * OptionGroupToggle
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Button, Box, Text } from 'grommet';
import { FormUp, FormDown } from 'grommet-icons';

import messages from './messages';

const Styled = styled((p) => <Button plain {...p} />)`
  color: ${palette('asideListGroup', 0)};
  padding: 0.25em 0;
  padding-right: 4px;
  &:hover {
    color: ${palette('asideListGroupHover', 0)};
  }
  border-bottom: 1px solid;
  border-bottom-color: ${({ expanded }) => expanded ? palette('light', 2) : 'transparent'};
`;

const Count = styled((p) => <Box {...p} />)`
  background-color: ${({ theme }) => theme.global.colors.highlight};
  border-radius: 9999px;
  padding: 0 4px;
  min-width: 24px;
  height: 24px;
  color: white;
`;

export function OptionGroupToggle({
  label, onToggle, expanded, activeCount, optionCount, intl,
}) {
  return (
    <Box>
      <Styled
        expanded={expanded}
        onClick={onToggle}
        title={intl.formatMessage(
          expanded ? messages.groupHide : messages.groupShow
        )}
      >
        <Box direction="row" justify="between" align="center">
          <Text size="xlarge" weight={600}>{label}</Text>
          <Box direction="row" align="center" gap="xsmall">
            {typeof activeCount !== 'undefined' && activeCount > 0 && (
              <Count alignContent="center" align="center" justify="center">
                <Text color="white" size="small">{`${activeCount}/${optionCount}`}</Text>
              </Count>
            )}
            {expanded && (
              <FormUp size="medium" />
            )}
            {!expanded && (
              <FormDown size="medium" />
            )}
          </Box>
        </Box>
      </Styled>
    </Box>
  );
}

OptionGroupToggle.propTypes = {
  label: PropTypes.string.isRequired,
  onToggle: PropTypes.func,
  expanded: PropTypes.bool,
  activeCount: PropTypes.number,
  optionCount: PropTypes.number,
  intl: intlShape,
};

export default injectIntl(OptionGroupToggle);
