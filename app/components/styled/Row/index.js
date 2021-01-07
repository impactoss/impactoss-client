import styled from 'styled-components';

const Row = styled.div`
  margin-right: -${({ theme }) => theme.gutter}px;
  margin-left: -${({ theme }) => theme.gutter}px;
  margin-top: ${({ space }) => space ? 10 : 0}px;
`;
export default Row;
