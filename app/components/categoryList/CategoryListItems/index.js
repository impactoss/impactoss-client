import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { mapToCategoryList } from 'utils/taxonomies';
import { getSortOption } from 'utils/sort';
import { getCategoryTitle } from 'utils/entities';

import CategoryListKey from 'components/categoryList/CategoryListKey';
import CategoryListHeader from 'components/categoryList/CategoryListHeader';
import CategoryListItem from 'components/categoryList/CategoryListItem';

import { SORT_ORDER_OPTIONS } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

const Styled = styled.div`
  position: relative;
`;
const CategoryListBody = styled.div`
  padding-top: 1em
`;
const GroupHeaderLink = styled(Link)`
  color: ${palette('link', 2)};
  &:hover {
    color: ${palette('linkHover', 2)};
  }
`;

const GroupHeader = styled.h6`
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 5px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 20px;
    margin-bottom: 10px;
  }
`;


class CategoryListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getCountAttributes = (taxonomy) => {
    // figure out if tagged directly or via child category
    const tagsRecs = taxonomy.getIn(['attributes', 'tags_recommendations'])
      || (taxonomy.get('children') && taxonomy.get('children').some((childTax) => childTax.getIn(['attributes', 'tags_recommendations'])));
    const tagsSDGTargets = taxonomy.getIn(['attributes', 'tags_sdgtargets'])
      || (taxonomy.get('children') && taxonomy.get('children').some((childTax) => childTax.getIn(['attributes', 'tags_sdgtargets'])));
    const tagsMeasures = taxonomy.getIn(['attributes', 'tags_measures'])
      || (taxonomy.get('children') && taxonomy.get('children').some((childTax) => childTax.getIn(['attributes', 'tags_measures'])));

    const attributes = [];
    if (tagsRecs) {
      attributes.push({
        total: 'recommendationsTotal',
        public: 'recommendations',
        accepted: 'recommendationsAccepted',
        label: this.context.intl.formatMessage(appMessages.entities.recommendations.plural),
      });
      if (!tagsMeasures) {
        attributes.push({
          via: this.context.intl.formatMessage(appMessages.entities.connected),
          total: 'measuresTotal',
          public: 'measures',
          label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
        });
      }
    }
    if (tagsSDGTargets) {
      attributes.push({
        total: 'sdgtargetsTotal',
        public: 'sdgtargets',
        label: this.context.intl.formatMessage(appMessages.entities.sdgtargets.plural),
      });
      if (!tagsMeasures) {
        attributes.push({
          via: this.context.intl.formatMessage(appMessages.entities.connected),
          total: 'measuresTotal',
          public: 'measures',
          label: this.context.intl.formatMessage(appMessages.entities.measures.plural),
        });
      }
    }
    if (tagsMeasures) {
      attributes.push({
        total: 'measuresTotal',
        public: 'measures',
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
      const columnSortOption = sortOptions.find((option) => option.query === attribute.public);
      const columnActive = columnSortOption.query === sortOptionActive.query;
      const columnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || columnSortOption.order) === option.value);
      return {
        type: 'count',
        header: attribute.label,
        via: attribute.via,
        width: ((1 - TITLE_COL_RATIO) / countAttributes.length) * 100,
        maxCount: this.getCategoryMaxCount(categories, attribute.public),
        countsIndex: i,
        entity: attribute.public,
        key: attribute.accepted !== null && typeof attribute.accepted !== 'undefined'
        ? [
          {
            label: this.context.intl.formatMessage(appMessages.ui.acceptedStatuses.accepted),
            palette: attribute.public,
            pIndex: 0,
          },
          {
            label: this.context.intl.formatMessage(appMessages.ui.acceptedStatuses.noted),
            palette: attribute.public,
            pIndex: 1,
          },
        ]
        : null,
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
      categoryGroups,
      reference,
      onPageLink,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
      userOnly,
    } = this.props;
    const countAttributes = (!userOnly && taxonomy) ? this.getCountAttributes(taxonomy) : [];
    const categories = categoryGroups.reduce((memo, group) =>
      memo.concat(group.get('categories'))
    , List());
    // console.log(categories.toJS())

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
        <CategoryListKey columns={columns} />
        <CategoryListHeader columns={columns} />
        <CategoryListBody>
          {categoryGroups.toArray().map((group) => {
            if (group.get('categories')) {
              const categoriesMapped = mapToCategoryList(group.get('categories'), onPageLink, countAttributes);
              return (
                <span key={group.get('id')}>
                  {group.get('type') === 'categories' && group.get('categories').size > 0 &&
                    <GroupHeaderLink to={`category/${group.get('id')}`}>
                      <GroupHeader>
                        {getCategoryTitle(group)}
                      </GroupHeader>
                    </GroupHeaderLink>
                  }
                  {categoriesMapped.map((cat) =>
                    <CategoryListItem
                      key={cat.id}
                      category={cat}
                      columns={columns}
                    />
                  )}
                </span>
              );
            }
            return null;
          })}
        </CategoryListBody>
      </Styled>
    );
  }
}

CategoryListItems.propTypes = {
  categoryGroups: PropTypes.object,
  taxonomy: PropTypes.object,
  reference: PropTypes.string,
  onPageLink: PropTypes.func,
  onSort: PropTypes.func,
  sortOptions: PropTypes.array,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  userOnly: PropTypes.bool,
};

CategoryListItems.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default CategoryListItems;
