import styled from 'styled-components';

const Row = styled.div`
  margin-right: -${(props) => props.theme.gutter}px;
  margin-left: -${(props) => props.theme.gutter}px;
`;
export default Row;
