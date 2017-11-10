import styled from 'styled-components';

export default styled.h1`
  font-family: ${(props) => props.theme.fonts.brandMain};
  font-size: ${(props) => props.theme.sizes.brandMain.header};
  text-transform: uppercase;
  margin: 0;
`;
