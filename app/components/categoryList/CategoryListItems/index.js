import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { mapToCategoryList } from 'utils/taxonomies';

import CategoryListHeader from 'components/categoryList/CategoryListHeader';
import CategoryListItem from 'components/categoryList/CategoryListItem';

import appMessages from 'containers/App/messages';

const Styled = styled.div``;
const CategoryListBody = styled.div`
  padding-top: 1em
`;

class CategoryListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getCountAttributes = (taxonomy) => {
    const attributes = [];
    if (taxonomy.getIn(['attributes', 'tags_recommendations'])) {
      attributes.push({
        attribute: 'recommendations',
        attributePublic: 'recommendationsPublic',
        attributeAccepted: 'recommendationsAccepted',
        label: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
      });
      if (!taxonomy.getIn(['attributes', 'tags_measures'])) {
        attributes.push({
          via: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
          entity: 'measures',
          attribute: 'recommendationConnectedMeasures',
          attributePublic: 'recommendationConnectedMeasuresPublic',
          label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
        });
      }
    }
    if (taxonomy.getIn(['attributes', 'tags_sdgtargets'])) {
      attributes.push({
        attribute: 'sdgtargets',
        attributePublic: 'sdgtargetsPublic',
        label: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
      });
      if (!taxonomy.getIn(['attributes', 'tags_measures'])) {
        attributes.push({
          via: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
          entity: 'measures',
          attribute: 'sdgtargetConnectedMeasures',
          attributePublic: 'sdgtargetConnectedMeasuresPublic',
          label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
        });
      }
    }
    if (taxonomy.getIn(['attributes', 'tags_measures'])) {
      attributes.push({
        attribute: 'measures',
        attributePublic: 'measuresPublic',
        label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
      });
    }
    return attributes;
  }
  getCategoryMaxCount = (categories, attribute) =>
    categories.reduce((countsMemo, cat) =>
      cat.get(attribute) && cat.get(attribute) > countsMemo
        ? cat.get(attribute)
        : countsMemo
    , 0);
  getListColumns = (taxonomyId, categories, countAttributes) => {
    const TITLE_COL_RATIO = 0.4;
    const columns = [
      {
        type: 'title',
        header: this.context.intl.formatMessage(appMessages.entities.taxonomies[taxonomyId].single),
        width: TITLE_COL_RATIO * 100,
      },
    ];
    return columns.concat(countAttributes.map((attribute, i) => ({
      type: 'count',
      header: attribute.label,
      width: ((1 - TITLE_COL_RATIO) / countAttributes.length) * 100,
      maxCount: this.getCategoryMaxCount(categories, attribute.attribute),
      countsIndex: i,
      entity: attribute.entity || attribute.attribute,
    })));
  }
  render() {
    const { taxonomy, categories, reference, onPageLink } = this.props;
    const countAttributes = (taxonomy) ? this.getCountAttributes(taxonomy) : [];
    const columns = this.getListColumns(reference, categories, countAttributes);
    const categoriesMapped = mapToCategoryList(categories, onPageLink, countAttributes);

    return (
      <Styled>
        <CategoryListHeader columns={columns} />
        <CategoryListBody>
          {categoriesMapped.map((cat, i) =>
            <CategoryListItem
              key={i}
              category={cat}
              columns={columns}
            />
          )}
        </CategoryListBody>
      </Styled>
    );
  }
}

CategoryListItems.propTypes = {
  categories: PropTypes.object,
  taxonomy: PropTypes.object,
  reference: PropTypes.string,
  onPageLink: PropTypes.func,
};

CategoryListItems.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default CategoryListItems;
