import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormWrapper = styled.div`
  -webkit-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  background-color: ${palette('greyscaleLight', 0)}
`;
export default FormWrapper;
