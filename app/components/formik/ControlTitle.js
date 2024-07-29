import styled from 'styled-components';
import ControlInput from './ControlInput';

const ControlTitle = styled(ControlInput)`
  font-size: 1.3em;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

export default ControlTitle;
