import styled from 'styled-components';

const FormFieldWrap = styled.div`
  display: ${({ nested, inline }) => (nested || inline) ? 'inline-block' : 'block'};
  vertical-align: top;
`;

export default FormFieldWrap;
