import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Tag = styled.button`
  display: inline-block;
  background: #ccc;
  padding: 1px 6px;
  margin: 0 3px;
  border-radius: 3px;
  font-size: 0.8em;
  &:hover {
    opacity: 0.8;
  }
`;
const Button = styled(Tag)`
  cursor: pointer;
`;

export default class EntityListItemMainBottomTaxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    tags: PropTypes.array.isRequired,
  }

  render() {
    return (
      <span>
        Categories:
        {
          this.props.tags.map((tag, i) => {
            if (tag.onClick) {
              return (<Button key={i} onClick={tag.onClick}>{tag.label}</Button>);
            }
            return (<Tag key={i}>{tag.label}</Tag>);
          })
        }
      </span>
    );
  }
}
