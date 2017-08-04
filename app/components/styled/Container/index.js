import styled from 'styled-components';

const Container = styled.div`
  margin-right: auto;
  margin-left: auto;
  max-width: ${(props) => props.isNarrow ? '960px' : '1170px'};
  padding-bottom: ${(props) => props.hasPaddingBottom ? '3em' : 0};
`;
export default Container;
