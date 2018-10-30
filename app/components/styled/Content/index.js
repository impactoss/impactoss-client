import styled from 'styled-components';

const Content = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0 16px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0 32px;
  }
`;
export default Content;
