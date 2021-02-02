import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

const getColor = (props, isHover = false) => {
  if (props.isSmartTag) {
    if (props.isSmart) {
      return isHover
        ? palette('taxonomiesHover', props.taxId || 0)
        : palette('taxonomies', props.taxId || 0);
    }
    return isHover
      ? palette('smartInactive', 1)
      : palette('smartInactive', 0);
  }
  if (!isHover || props.disabled) {
    return palette('taxonomies', props.taxId || 0);
  }
  return palette('taxonomiesHover', props.taxId || 0);
};

// eslint-disable no-nested-ternary
const ButtonTagCategory = styled(Button)`
  color: ${palette('text', 2)};
  background-color: ${(props) => getColor(props)};
  margin-right: 2px;
  border-radius: ${(props) => props.isSmartTag ? 9999 : 3}px;
  padding: 1px 6px;
  font-size: 0.85em;
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  border: 1px solid ${(props) => getColor(props)};
  &:hover {
    color: ${palette('text', 2)};
    background-color: ${(props) => getColor(props, true)};
    border-color: ${(props) => getColor(props, true)};
  }
  &:last-child {
    margin-right: 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 1px 6px;
    font-size: 0.85em;
  }
  @media print {
    color: ${palette('text', 1)};
    background: transparent;
    border: none;
    border-radius: 0;
    border-top: 3px solid;
    border-color: ${(props) => getColor(props)};
    margin-right: 10px;
    padding: 1px 2px;
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

export default ButtonTagCategory;
