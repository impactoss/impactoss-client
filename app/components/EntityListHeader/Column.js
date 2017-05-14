import styled from 'styled-components';
import { palette } from 'styled-theme';

const Column = styled.div`
  width:${(props) => props.width * 100}%;
  display: inline-block;
  padding: 0.25em 1em;
  border-right: 1px solid ${palette('greyscaleLight', 2)};
  font-size: 0.85em;
  &:last-child {
    border-right: none;
  }
`;
export default Column;
