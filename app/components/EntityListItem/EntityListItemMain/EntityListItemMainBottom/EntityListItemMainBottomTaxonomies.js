import React, { PropTypes } from 'react';

import Icon from 'components/Icon';
import ButtonCategoryTag from 'components/buttons/ButtonCategoryTag';
import BottomTagGroup from './BottomTagGroup';

export default class EntityListItemMainBottomTaxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    tags: PropTypes.array.isRequired,
  }

  render() {
    return (
      <BottomTagGroup>
        <Icon name="categories" text />
        {
          this.props.tags.map((tag, i) => (
            <ButtonCategoryTag
              key={i}
              onClick={tag.onClick}
              taxId={parseInt(tag.taxId, 10)}
              disabled={!tag.onClick}
              title={tag.title}
            >
              {tag.label}
            </ButtonCategoryTag>
          ))
        }
      </BottomTagGroup>
    );
  }
}
