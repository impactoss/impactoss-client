import styled from 'styled-components';

const FieldWrap = styled.div`
  display: block;
  position: relative;
  a:focus-visible {
    outline: none;
    text-decoration: underline;
  }
`;

export default FieldWrap;
