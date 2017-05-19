import { Control } from 'react-redux-form/immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const ControlShort = styled(Control.input)`
  background-color: ${palette('primary', 4)};
  max-width: 100px;
  border:1px solid ${palette('light', 1)};
  padding: 0.7em;
  border-radius: 0.5em;
`;
export default ControlShort;
