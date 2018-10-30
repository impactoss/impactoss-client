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
`;

export default ButtonTagCategoryInverse;
