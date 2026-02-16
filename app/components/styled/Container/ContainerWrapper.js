import styled from 'styled-components';

const ContainerWrapper = styled.div`
display: flex;
flex-direction: column;
position: absolute;
top: 0;
bottom: 0;
left: 0;
right:0;
overflow-y: auto;
@media print {
  position: static;
}
`;
export default ContainerWrapper;
