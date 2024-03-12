/*
 *
 * OptionListHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import IndeterminateCheckbox, { STATES } from 'components/forms/IndeterminateCheckbox';
const Checkbox = styled(IndeterminateCheckbox)`
  vertical-align: middle;
`;
const Select = styled.div`
  width: 20px;
  text-align: center;
  padding-right: 6px;
  position: relative;
`;

export function OptionListHeader({
  labels,
  activeCount,
  optionCount,
  onSelect,
  listGroupId,
}) {
  let state;
  if (optionCount) {
    if (optionCount === activeCount) state = STATES.CHECKED;
    if (optionCount !== activeCount) state = STATES.INDETERMINATE;
    if (!activeCount || activeCount === 0) state = STATES.UNCHECKED;
  }
  const hasSelectAll = typeof state !== 'undefined' && onSelect && listGroupId;
  return (
    <Box
      direction="row"
      gap="small"
      align="center"
      justify="between"
      pad={{ bottom: 'small' }}
      margin={{ bottom: 'small' }}
      border={{ side: 'bottom', color: 'rgba(0,0,0,0.33)' }}
    >
      <Box>
        {hasSelectAll && (
          <Box direction="row" gap="small" align="center" justify="start" flex={false}>
            <Select>
              <Checkbox
                id={`select-all-${listGroupId}`}
                checked={state}
                onChange={(checked) => onSelect(checked)}
              />
            </Select>
            <Text as="label" htmlFor={`select-all-${listGroupId}`} style={{ fontWeight: 700 }}>
              {labels.attributes}
            </Text>
          </Box>
        )}
        {!hasSelectAll && labels.attributes && (
          <Text style={{ fontWeight: 700 }}>{labels.attributes}</Text>
        )}
      </Box>
      {labels.columns && (<Text style={{ fontWeight: 700 }}>{labels.columns}</Text>)}
    </Box>
  );
}

OptionListHeader.propTypes = {
  labels: PropTypes.object,
  listGroupId: PropTypes.string,
  activeCount: PropTypes.number,
  optionCount: PropTypes.number,
  onSelect: PropTypes.func,
};

export default OptionListHeader;
