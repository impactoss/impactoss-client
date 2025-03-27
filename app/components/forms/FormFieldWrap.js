import styled from 'styled-components';
import { palette } from 'styled-theme';

const FormFieldWrap = styled.div`
  display: ${({ nested, inline }) => (nested || inline) ? 'inline-block' : 'block'};
  vertical-align: top;
  textarea:focus-visible {
    outline: 2px solid  ${palette('primary', 0)};
    border-radius: 0.5em;
  }
  select:focus-visible, input:focus-visible {
    outline: 2px solid  ${palette('primary', 0)};
  }
  a:focus-visible {
    outline: none;
    text-decoration: underline;
  }
`;

export default FormFieldWrap;
