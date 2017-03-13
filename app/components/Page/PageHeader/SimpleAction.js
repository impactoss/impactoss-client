import styled from 'styled-components';

const SimpleAction = styled.button`
  font-weight:bold;
  display: inline-block;
  text-transform:uppercase;
  height:${(props) => props.theme.sizes.h1};
  padding:0 30px;
  cursor:pointer;
`;

export default SimpleAction;
