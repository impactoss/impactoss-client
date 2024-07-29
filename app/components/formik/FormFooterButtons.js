import styled from 'styled-components';

const FormFooterButtons = styled.div`
  text-align: ${(props) => props.left ? 'left' : 'right'};
  float: ${(props) => props.left ? 'left' : 'right'};
`;

export default FormFooterButtons;
