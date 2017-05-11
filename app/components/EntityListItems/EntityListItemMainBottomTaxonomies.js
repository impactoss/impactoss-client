import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import Icon from 'components/Icon';

const Styled = styled.span`
  display: inline-block;
  color: ${palette('greyscaleLight', 3)};
`;

const Tag = styled.button`
  display: inline-block;
  color: ${palette('primary', 4)};
  background-color: ${(props) => palette('taxonomies', props.pIndex)};
  padding: 1px 6px;
  margin-right: 2px;
  border-radius: 3px;
  font-size: 0.85em;
`;
const Button = styled(Tag)`
  cursor: pointer;
  &:hover {
    background-color: ${(props) => palette('taxonomiesHover', props.pIndex)};
  }
`;

export default class EntityListItemMainBottomTaxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    tags: PropTypes.array.isRequired,
  }

  render() {
    return (
      <Styled>
        <Icon name="categories" text />
        {
          this.props.tags.map((tag, i) => {
            if (tag.onClick) {
              return (
                <Button key={i} onClick={tag.onClick} pIndex={parseInt(tag.taxId, 10)}>
                  {tag.label}
                </Button>
              );
            }
            return (
              <Tag key={i} pIndex={parseInt(tag.taxId, 10)}>
                {tag.label}
              </Tag>
            );
          })
        }
      </Styled>
    );
  }
}
