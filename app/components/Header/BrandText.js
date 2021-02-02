import styled from 'styled-components';

export default styled.div`
  float:left;
  padding: 9px 0px 0px 0px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 5px 20px;
  }
  @media print {
    padding: 5px 10px;
  }
`;
