import styled from 'styled-components';

const PrintOnly = styled.div`
  display: none;
  @media print {
    display: ${({ displayProp }) => displayProp || 'block'};
  }
`;

export default PrintOnly;
