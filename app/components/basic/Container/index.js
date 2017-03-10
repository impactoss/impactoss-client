import styled from 'styled-components';

const Container = styled.div`
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: 750px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    width: 970px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    width: 1170px;
  }
`;
export default Container;
