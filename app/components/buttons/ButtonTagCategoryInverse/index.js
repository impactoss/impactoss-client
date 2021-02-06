import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from '../Button';

// eslint-disable no-nested-ternary
const ButtonTagCategoryInverse = styled(Button)`
  background-color: ${palette('buttonInverse', 1)};
  color: ${(props) => palette('taxonomies', props.taxId || 0)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
  border: 1px solid;
  cursor:${(props) => props.disabled ? 'default' : 'pointer'};
  &:hover {
    background-color: ${palette('buttonInverseHover', 1)};
    color: ${(props) => props.disabled
    ? palette('taxonomies', props.taxId || 0)
    : palette('taxonomiesHover', props.taxId || 0)
};
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
    border-radius: 3px;
    border-right: 1px solid;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-left: 7px solid;
    border-color: ${(props) => props.disabled
    ? palette('taxonomies', props.taxId || 0)
    : palette('taxonomiesHover', props.taxId || 0)
};
    margin-right: 10px;
    padding: 0 4px;
    font-size: ${(props) => props.theme.sizes.print.smallest};
    line-height: 10pt;
    &:hover {
      color: ${palette('text', 1)};
      background-color: transparent;
      border-color: ${(props) => props.disabled
    ? palette('taxonomies', props.taxId || 0)
    : palette('taxonomiesHover', props.taxId || 0)
};
    }
`;

export default ButtonTagCategoryInverse;
