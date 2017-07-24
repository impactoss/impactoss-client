import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { mapToCategoryList } from 'utils/taxonomies';
import { getSortOption } from 'utils/sort';

import CategoryListHeader from 'components/categoryList/CategoryListHeader';
import CategoryListItem from 'components/categoryList/CategoryListItem';

import { SORT_ORDER_OPTIONS } from 'containers/App/constants';
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
          attribute: 'measures',
          attributePublic: 'measuresPublic',
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
          attribute: 'measures',
          attributePublic: 'measuresPublic',
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

  getListColumns = ({ taxonomyHeader, categories, countAttributes, sortOptions, sortBy, sortOrder, onSort }) => {
    const TITLE_COL_RATIO = 0.4;

    const sortOptionActive = getSortOption(sortOptions, sortBy, 'query');
    const titleColumnSortOption = sortOptions.find((option) => option.query === 'title');
    const titleColumnActive = titleColumnSortOption.query === sortOptionActive.query;
    const titleColumnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || titleColumnSortOption.order) === option.value);
    const columns = [
      {
        type: 'title',
        header: taxonomyHeader,
        width: TITLE_COL_RATIO * 100,
        sortIcon: titleColumnActive && titleColumnSortOrderOption
          ? titleColumnSortOrderOption.icon
          : 'sorting',
        onClick: () => {
          if (titleColumnActive) {
            const nextSortOrderOption = SORT_ORDER_OPTIONS.find((option) => titleColumnSortOrderOption.nextValue === option.value);
            onSort(titleColumnSortOption.query, nextSortOrderOption.value);
          } else {
            onSort(titleColumnSortOption.query, titleColumnSortOption.order);
          }
        },
      },
    ];
    return columns.concat(countAttributes.map((attribute, i) => {
      const columnSortOption = sortOptions.find((option) => option.query === attribute.attribute);
      const columnActive = columnSortOption.query === sortOptionActive.query;
      const columnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || columnSortOption.order) === option.value);
      return {
        type: 'count',
        header: attribute.label,
        via: attribute.via,
        width: ((1 - TITLE_COL_RATIO) / countAttributes.length) * 100,
        maxCount: this.getCategoryMaxCount(categories, attribute.attribute),
        countsIndex: i,
        entity: attribute.attribute,
        sortIcon: columnActive && columnSortOrderOption
          ? columnSortOrderOption.icon
          : 'sorting',
        onClick: () => {
          if (columnActive) {
            const nextSortOrderOption = SORT_ORDER_OPTIONS.find((option) => columnSortOrderOption.nextValue === option.value);
            onSort(columnSortOption.query, nextSortOrderOption.value);
          } else {
            onSort(columnSortOption.query, columnSortOption.order);
          }
        },
      };
    }));
  };
  render() {
    const {
      taxonomy,
      categories,
      reference,
      onPageLink,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
    } = this.props;
    const countAttributes = (taxonomy) ? this.getCountAttributes(taxonomy) : [];
    const categoriesMapped = mapToCategoryList(categories, onPageLink, countAttributes);

    const columns = this.getListColumns({
      taxonomyHeader: this.context.intl.formatMessage(appMessages.entities.taxonomies[reference].single),
      categories,
      countAttributes,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
    });

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
  onSort: PropTypes.func,
  sortOptions: PropTypes.array,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
};

CategoryListItems.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default CategoryListItems;
