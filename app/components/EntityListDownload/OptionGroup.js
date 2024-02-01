/*
 *
 * OptionGroup
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
import DebounceInput from 'react-debounce-input';

import styled from 'styled-components';
import { Box, Text } from 'grommet';

import OptionGroupToggle from './OptionGroupToggle';
import OptionListHeader from './OptionListHeader';

const Select = styled.div`
  width: 20px;
  text-align: center;
  padding-right: 6px;
`;

const TextInput = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  padding: 3px;
  flex: 1;
  font-size: 0.85em;
  width: 200px;
  border-radius: 0.5em;
  &:focus {
    outline: none;
  }

`;

const Group = styled((p) => (
  <Box {...p} />
))`
  border-top: 1px solid ${palette('light', 2)};
  &:last-child {
    border-bottom: 1px solid ${palette('light', 2)};
  }
`;

const StyledInput = styled.input`
  accent-color: ${({ theme }) => theme.global.colors.highlight};
`;

const OptionLabel = styled((p) => <Text as="label" {...p} />)`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export function OptionGroup({
  label,
  onExpandGroup,
  expandedId,
  groupId,
  activeOptionCount,
  optionCount,
  intro,
  introNode,
  options,
  optionListLabels,
  onSetOptions,
  onSetAsRows,
  asRows,
  asRowsDisabled,
  asRowsLabels,
  editColumnNames,
  active,
  onSetActive,
  onActiveLabel,
}) {
  const expandGroup = expandedId === groupId;
  if (!optionCount || optionCount === 0) {
    return null;
  }
  return (
    <Group>
      <OptionGroupToggle
        label={label}
        onToggle={() => onExpandGroup(!expandGroup ? groupId : null)}
        expanded={expandGroup}
        activeCount={activeOptionCount}
        optionCount={optionCount}
      />
      {expandGroup && (
        <Box gap="small" margin={{ vertical: 'medium' }}>
          {intro && (
            <Box>
              <Text size="small">{intro}</Text>
            </Box>
          )}
          {!intro && introNode}
          {onSetActive && (
            <Box direction="row" gap="small" align="center" justify="start">
              <Select>
                <StyledInput
                  id={`check-${groupId}`}
                  type="checkbox"
                  checked={active}
                  onChange={(evt) => onSetActive(evt.target.checked)}
                />
              </Select>
              <OptionLabel htmlFor={`check-${groupId}`}>
                {onActiveLabel}
              </OptionLabel>
            </Box>
          )}
          {options && (
            <Box margin={{ top: 'medium' }}>
              <OptionListHeader
                labels={optionListLabels}
                listGroupId={groupId}
                activeCount={activeOptionCount}
                optionCount={optionCount}
                onSelect={(selected) => {
                  const updated = Object.keys(options).reduce((memo, key) => ({
                    ...memo,
                    [key]: {
                      ...options[key],
                      active: selected,
                    },
                  }), {});
                  onSetOptions(updated);
                }}
              />
              <Box gap="xsmall">
                {Object.keys(options).map((key) => {
                  const option = options[key];
                  return (
                    <Box key={key} direction="row" gap="small" align="center" justify="between">
                      <Box direction="row" gap="small" align="center" justify="start">
                        <Select>
                          <StyledInput
                            id={`check-${groupId}-${key}`}
                            type="checkbox"
                            checked={option.exportRequired || option.active}
                            disabled={option.exportRequired}
                            onChange={(evt) => {
                              onSetOptions({
                                ...options,
                                [key]: {
                                  ...option,
                                  active: evt.target.checked,
                                },
                              });
                            }}
                          />
                        </Select>
                        <OptionLabel htmlFor={`check-${groupId}-${key}`}>
                          {option.label}
                        </OptionLabel>
                      </Box>
                      {editColumnNames && option.column && (
                        <Box>
                          <TextInput
                            minLength={1}
                            debounceTimeout={500}
                            value={option.column}
                            onChange={(evt) => {
                              onSetOptions({
                                ...options,
                                [key]: {
                                  ...option,
                                  column: evt.target.value,
                                },
                              });
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          {onSetAsRows && (
            <Box gap="edge">
              <Box direction="row" gap="small" align="center" justify="start">
                <Select>
                  <StyledInput
                    id={`check-${groupId}-as-columns`}
                    type="radio"
                    checked={!asRows}
                    onChange={(evt) => onSetAsRows(!evt.target.checked)}
                    disabled={asRowsDisabled}
                  />
                </Select>
                <OptionLabel
                  htmlFor={`check-${groupId}-as-columns`}
                  disabled={asRowsDisabled}
                >
                  {asRowsLabels.columns}
                </OptionLabel>
              </Box>
              <Box direction="row" gap="small" align="center" justify="start">
                <Select>
                  <StyledInput
                    id={`check-${groupId}-as-rows`}
                    type="radio"
                    checked={asRows}
                    onChange={(evt) => onSetAsRows(evt.target.checked)}
                    disabled={asRowsDisabled}
                  />
                </Select>
                <OptionLabel
                  htmlFor={`check-${groupId}-as-rows`}
                  disabled={asRowsDisabled}
                >
                  {asRowsLabels.rows}
                </OptionLabel>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Group>
  );
}

OptionGroup.propTypes = {
  label: PropTypes.string,
  onExpandGroup: PropTypes.func,
  expandedId: PropTypes.string,
  groupId: PropTypes.string,
  activeOptionCount: PropTypes.number,
  optionCount: PropTypes.number,
  intro: PropTypes.string,
  introNode: PropTypes.node,
  options: PropTypes.object,
  optionListLabels: PropTypes.object,
  onSetOptions: PropTypes.func,
  onSetAsRows: PropTypes.func,
  asRows: PropTypes.bool,
  asRowsDisabled: PropTypes.bool,
  asRowsLabels: PropTypes.object,
  editColumnNames: PropTypes.bool,
  active: PropTypes.bool,
  onSetActive: PropTypes.func,
  onActiveLabel: PropTypes.string,
};

export default OptionGroup;
