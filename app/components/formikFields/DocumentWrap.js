import styled from 'styled-components';
import { palette } from 'styled-theme';

const DocumentWrap = styled.div`
  display: block;
  border-bottom: 1px solid ${palette('light', 0)};
  border-top: 1px solid ${palette('light', 0)};
  padding: 1em 0;
`;

export default DocumentWrap;
