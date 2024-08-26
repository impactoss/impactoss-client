import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormFooter = styled.div`
  border-top: 1px solid ${palette('light', 2)};
  position: relative;
  display: table-caption;
  caption-side: bottom;
`;

export default FormFooter;
