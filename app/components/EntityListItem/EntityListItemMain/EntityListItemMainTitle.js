import styled from 'styled-components';

const EntityListItemMainTitle = styled.div`
  font-weight: ${(props) => props.nested ? 'normal' : 500};
  font-size: ${(props) => props.nested ? '1em' : '1.1em'};
`;

export default EntityListItemMainTitle;
