import styled from 'styled-components';

const EntityListItemMainTitle = styled.div`
  font-weight: normal;
  font-size: ${(props) => props.theme.sizes && props.theme.sizes.text.nestedListItem};
  @media (min-width: ${(props) => props.theme.breakpoints ? props.theme.breakpoints.medium : '993px'}) {
    font-size: ${(props) => props.nested
    ? (props.theme.sizes && props.theme.sizes.text.nestedListItem)
    : (props.theme.sizes && props.theme.sizes.text.mainListItem)
};
    line-height: 1.2em;
  }
  @media print {
    font-size: ${(props) => props.nested
    ? (props.theme.sizes && props.theme.sizes.print.nestedListItem)
    : (props.theme.sizes && props.theme.sizes.print.mainListItem)
}
  }
`;

export default EntityListItemMainTitle;
