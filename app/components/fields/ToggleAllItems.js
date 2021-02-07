import styled from 'styled-components';
import { palette } from 'styled-theme';
import Button from 'components/buttons/Button';

const ToggleAllItems = styled(Button)`
  padding: 0.5em 0;
  font-size: 0.85em;
  font-weight: bold;
  color: ${palette('link', 0)};
  &:hover {
    color: ${palette('linkHover', 0)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0.5em 0;
    font-size: 0.85em;
  }
  @media print {
    display: none;
  }
`;
export default ToggleAllItems;
