import styled from 'styled-components';
import { palette } from 'styled-theme';

const ViewWrapper = styled.div`
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  background: ${palette('primary', 4)};
`;
export default ViewWrapper;
