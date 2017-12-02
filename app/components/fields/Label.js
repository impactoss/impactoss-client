import styled from 'styled-components';
import { palette } from 'styled-theme';

const Label = styled.div`
  color: ${palette('text', 1)};
  font-weight: 500;
  font-size: ${(props) => props.theme.sizes.text.small};
  position: relative;
  width: 100%;
`;

export default Label;
