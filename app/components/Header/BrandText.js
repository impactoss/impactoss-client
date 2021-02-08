import styled from 'styled-components';

export default styled.div`
  float: left;
  padding: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    float:left;
    padding: 5px 20px;
  }
  @media print {
    padding: 5px 10px;
  }
`;
