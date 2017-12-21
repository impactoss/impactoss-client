import styled from 'styled-components';

const Field = styled.div`
  display: ${(props) => props.nested ? 'inline-block' : 'block'};
  padding-bottom: ${(props) => {
    if (props.nested || props.noPadding) {
      return 0;
    }
    if (props.labelledGroup) {
      return 15;
    }
    return 30;
  }}px;
`;

export default Field;
