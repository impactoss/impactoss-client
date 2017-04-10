import { Control } from 'react-redux-form/immutable';
import styled from 'styled-components';

const ControlTextArea = styled(Control.textarea)`
  background:#ffffff;
  width:100%;
  border:1px solid #E0E1E2;
  min-height:5em;
  color:#000;
  padding:5px;
`;

export default ControlTextArea;
