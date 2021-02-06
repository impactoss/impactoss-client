import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessages from 'containers/App/messages';

import ButtonTagCategory from 'components/buttons/ButtonTagCategory';
import ButtonTagCategoryInverse from 'components/buttons/ButtonTagCategoryInverse';

import { truncateText } from 'utils/string';
import { TEXT_TRUNCATE } from 'themes/config';

const SmartGroup = styled.div`
  display: inline-block;
  margin-right: 0.5em;
  padding-right: 0.5em;
  border-right: ${(props) => props.border ? '1px solid' : 'none'};
  border-right-color: ${palette('light', 3)};
`;
const Styled = styled.div`
  width: 100%;
  display: block;
  padding-top: 3px;
  margin-top: 8px;
  @media print {
    padding-top: 2px;
    margin-top: 3px;
  }
`;
// border-top-color:;

class EntityListItemMainBottomTaxonomies extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getEntityTags = (categories, taxonomies, onClick) => {
    const tags = [];
    if (categories) {
      taxonomies
        .filter((tax) => !tax.getIn(['attributes', 'is_smart']))
        .sortBy((tax) => tax.getIn(['attributes', 'priority']))
        .forEach((tax) => {
          tax
            .get('categories')
            .sortBy((category) => category.getIn(['attributes', 'draft']))
            .forEach((category, catId) => {
              if (categories.includes(parseInt(catId, 10))) {
                const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
                  ? category.getIn(['attributes', 'short_title'])
                  : category.getIn(['attributes', 'title']));
                tags.push({
                  taxId: tax.get('id'),
                  title: category.getIn(['attributes', 'title']),
                  inverse: category.getIn(['attributes', 'draft']),
                  label: truncateText(label, TEXT_TRUNCATE.ENTITY_TAG, categories.size < 5),
                  onClick: () => onClick(catId, 'category'),
                });
              }
            });
        });
    }
    return tags;
  };

  getSmartTitle = (title, isSmart) => {
    const { intl } = this.context;
    return intl
      ? `${title}: ${intl.formatMessage(isSmart ? appMessages.labels.smart.met : appMessages.labels.smart.notMet)}`
      : title;
  };

  getEntitySmartTags = (categories, smartTaxonomy, onClick) => {
    const tags = [];
    smartTaxonomy
      .get('categories')
      .forEach((category, catId) => {
        const label = (category.getIn(['attributes', 'short_title']) && category.getIn(['attributes', 'short_title']).trim().length > 0
          ? category.getIn(['attributes', 'short_title'])
          : category.getIn(['attributes', 'title']));
        const isSmart = categories.includes(parseInt(catId, 10));
        tags.push({
          taxId: smartTaxonomy.get('id'),
          title: this.getSmartTitle(category.getIn(['attributes', 'title']), isSmart),
          isSmart,
          label: truncateText(label, TEXT_TRUNCATE.ENTITY_TAG, false),
          onClick: () => onClick(catId, 'category'),
        });
      });
    return tags;
  };


  render() {
    const { categories, taxonomies, onEntityClick } = this.props;
    const smartTaxonomy = taxonomies && taxonomies.find((tax) => tax.getIn(['attributes', 'is_smart']));
    const entityTags = this.getEntityTags(categories, taxonomies, onEntityClick);

    return (
      <Styled>
        { smartTaxonomy
          && (
            <SmartGroup border={entityTags && entityTags.length > 0}>
              { this.getEntitySmartTags(categories, smartTaxonomy, onEntityClick).map((tag, i) => (
                <ButtonTagCategory
                  key={i}
                  onClick={tag.onClick}
                  taxId={parseInt(tag.taxId, 10)}
                  title={tag.title}
                  isSmartTag
                  isSmart={tag.isSmart}
                >
                  {tag.label}
                </ButtonTagCategory>
              ))}
            </SmartGroup>
          )
        }
        { entityTags.map((tag, i) => tag.inverse
          ? (
            <ButtonTagCategoryInverse
              key={i}
              onClick={tag.onClick}
              taxId={parseInt(tag.taxId, 10)}
              disabled={!tag.onClick}
              title={tag.title}
            >
              {tag.label}
            </ButtonTagCategoryInverse>
          )
          : (
            <ButtonTagCategory
              key={i}
              onClick={tag.onClick}
              taxId={parseInt(tag.taxId, 10)}
              disabled={!tag.onClick}
              title={tag.title}
            >
              {tag.label}
            </ButtonTagCategory>
          ))}
      </Styled>
    );
  }
}

EntityListItemMainBottomTaxonomies.propTypes = {
  categories: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  taxonomies: PropTypes.instanceOf(Map), // eslint-disable-line react/no-unused-prop-types
  onEntityClick: PropTypes.func,
};

EntityListItemMainBottomTaxonomies.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListItemMainBottomTaxonomies;
