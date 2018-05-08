import styled from 'styled-components';

export default styled.div`
  float:left;
  padding: 9px 0px 0px 0px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 21px 20px 10px 20px;
  }
`;

// TODO @tmfrnz config
// padding
