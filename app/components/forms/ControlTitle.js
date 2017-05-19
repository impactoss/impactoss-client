import { Control } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const ControlTitle = styled(Control.input)`
  background-color: ${palette('primary', 4)};
  width:100%;
  border:1px solid ${palette('light', 1)};
  padding: 0.7em;
  border-radius: 0.5em;
  font-size: 1.3em;
`;

export default ControlTitle;
