import styled from 'styled-components';

const Container = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: ${(props) => props.isNarrow ? '960px' : '1170px'};
  padding-bottom: 3em;
`;
export default Container;
