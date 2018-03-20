import styled from 'styled-components';

export default styled.h1`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: ${(props) => props.theme.sizes.header.text.title};
  margin: 0;
`;
// TODO @tmfrnz config
// text-transform
// text-transform: uppercase;
