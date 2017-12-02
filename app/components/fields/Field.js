import styled from 'styled-components';

const Field = styled.div`
  display: ${(props) => props.nested ? 'inline-block' : 'block'};
  padding-bottom: ${(props) => props.nested ? 0 : 30}px;
`;

export default Field;
