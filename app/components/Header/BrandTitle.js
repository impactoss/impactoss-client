import styled from 'styled-components';

export default styled.h1`
  font-family: ${(props) => props.theme.fonts.headerBrandMain};
  font-size: ${(props) => props.theme.sizes.headerBrandMain};
  margin: 8px 0 0 0;
`;
// text-transform: uppercase;
