import styled from 'styled-components';
import { palette } from 'styled-theme';

const ViewWrapper = styled.div`
  box-shadow: ${(props) => props.seamless ? 'none' : '0px 0px 10px 0px rgba(0,0,0,0.2)'};
  background: ${palette('background', 0)};
`;
export default ViewWrapper;
