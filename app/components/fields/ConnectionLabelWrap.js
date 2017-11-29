import styled from 'styled-components';
import ListLabelWrap from './ListLabelWrap';

const ConnectionLabelWrap = styled(ListLabelWrap)`
  border-bottom: none;
  padding-bottom: ${(props) => props.hasButton ? 10 : 5}px;
`;

export default ConnectionLabelWrap;
