import styled from 'styled-components';

const FormFieldWrap = styled.div`
  display: ${(props) => props.nested ? 'inline-block' : 'block'};
  vertical-align: top;
`;

export default FormFieldWrap;
