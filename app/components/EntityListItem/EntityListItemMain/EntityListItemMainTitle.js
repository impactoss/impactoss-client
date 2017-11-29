import styled from 'styled-components';

const EntityListItemMainTitle = styled.div`
  font-weight: normal;
  font-size: ${(props) => props.nested
    ? (props.theme.sizes && props.theme.sizes.text.nestedListItem)
    : (props.theme.sizes && props.theme.sizes.text.mainListItem)
  };
  line-height: ${(props) => props.theme.sizes && props.theme.sizes.lineHeights.mainListItem};
`;

export default EntityListItemMainTitle;
