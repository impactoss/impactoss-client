import styled from 'styled-components';
import { palette } from 'styled-theme';
import Button from 'components/buttons/Button';
const ToggleAllItems = styled(Button)`
  padding: 0.5em 0;
  font-weight: bold;
  font-size: 0.85em;
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
  }
`;
export default ToggleAllItems;
