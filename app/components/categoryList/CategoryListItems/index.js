import React from 'react';
import Link from 'containers/Link';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { getSortOption } from 'utils/sort';
import { getCategoryTitle } from 'utils/entities';
import { qe } from 'utils/quasi-equals';

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
  margin-top: 6px;
  margin-bottom: 3px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  @media print {
    margin-top: 30px;
    margin-bottom: 6px;
    padding-bottom: 2px;
    font-weight: bold;
    font-size: ${(props) => props.theme.sizes.print.smaller};
    color: ${palette('text', 1)};
  }
`;

const TITLE_COL_RATIO = 0.4;

class CategoryListItems extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getTagsTax = (taxonomy, tagsAttribute) => taxonomy.getIn(['attributes', tagsAttribute])
    || (
      taxonomy.get('children')
      && taxonomy.get('children').some(
        (childTax) => childTax.getIn(['attributes', tagsAttribute]),
      )
    );

  getColumnKeys = (taxonomy, frameworks) => {
    const { intl } = this.context;
    // figure out if tagged directly or via child category
    const tagsRecs = this.getTagsTax(taxonomy, 'tags_recommendations');
    return tagsRecs && frameworks && taxonomy.get('frameworkIds').toArray().reduce(
      (memo, fwid) => {
        const framework = frameworks.find((fw) => qe(fw.get('id'), fwid));
        // TODO figure out multiple framework with responses
        if (framework && framework.getIn(['attributes', 'has_response'])) {
          return [{
            items: [
              {
                label: intl.formatMessage(appMessages.ui.acceptedStatuses.accepted),
                palette: 'recommendations',
                pIndex: 0,
              },
              {
                label: intl.formatMessage(appMessages.ui.acceptedStatuses.noted),
                palette: 'recommendations',
                pIndex: 1,
              },
            ],
          }];
        }
        return memo;
      },
      [],
    );
  };

  getHeaderAttributes = (taxonomy, frameworkId, frameworks) => {
    const { intl } = this.context;
    // figure out if tagged directly or via child category
    const tagsRecs = this.getTagsTax(taxonomy, 'tags_recommendations');
    const tagsMeasures = this.getTagsTax(taxonomy, 'tags_measures');
    const isList = taxonomy.get('frameworkIds')
      && taxonomy.get('frameworkIds').size > 1;
    const fwSet = frameworkId && frameworkId !== 'all';
    const attributes = [];
    // directly associated objectives/recommendations
    if (tagsRecs) {
      let recLabel;
      if (isList && !fwSet) {
        recLabel = `${intl.formatMessage(
          appMessages.entities.recommendations.plural
        )} (${intl.formatMessage(
          appMessages.frameworks.all
        )})`;
      } else if (fwSet) {
        recLabel = intl.formatMessage(appMessages.entities[`recommendations_${frameworkId}`].plural);
      } else {
        const fwId = taxonomy.get('frameworkIds').first();
        recLabel = intl.formatMessage(appMessages.entities[`recommendations_${fwId}`].plural);
      }
      attributes.push({
        query: 'recommendations',
        label: recLabel,
        keys: this.getColumnKeys(taxonomy, frameworks),
      });
      // indirectly associated/inferred actions
      if (!tagsMeasures) {
        attributes.push({
          via: intl.formatMessage(appMessages.entities.connected),
          query: 'measures',
          label: intl.formatMessage(appMessages.entities.measures.plural),
        });
      }
    }
    // directly associated measures
    if (tagsMeasures) {
      attributes.push({
        query: 'measures',
        label: intl.formatMessage(appMessages.entities.measures.plural),
      });
    }
    return attributes;
  }

  getListHeaderColumns = ({
    taxonomy,
    frameworkId,
    sortOptions,
    sortBy,
    sortOrder,
    onSort,
    userOnly,
    isGrouped,
    frameworks,
  }) => {
    const { intl } = this.context;
    const sortOptionActive = getSortOption(sortOptions, sortBy, 'query');
    const titleColumnSortOption = sortOptions.find((option) => option.query === 'title');
    const titleColumnActive = titleColumnSortOption.query === sortOptionActive.query;
    const titleColumnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || titleColumnSortOption.order) === option.value);
    const headerAttributes = this.getHeaderAttributes(taxonomy, frameworkId, frameworks);
    // category title column
    const columns = [
      {
        type: 'title',
        header: intl.formatMessage(appMessages.entities.taxonomies[taxonomy.get('id')].single),
        by: isGrouped && intl.formatMessage(
          appMessages.labels.groupedByTaxonomy,
          {
            tax: intl.formatMessage(
              appMessages.entities.taxonomies[taxonomy.getIn(['parent', 'id'])].single
            ),
          }
        ),
        width: (userOnly || headerAttributes.length === 0) ? 100 : TITLE_COL_RATIO * 100,
        active: titleColumnActive,
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
    // add columns for associated recs and measures
    return userOnly
      ? columns
      : columns.concat(headerAttributes.map((attribute) => {
        const columnSortOption = sortOptions.find((option) => option.query === attribute.query);
        const columnActive = columnSortOption.query === sortOptionActive.query;
        const columnSortOrderOption = SORT_ORDER_OPTIONS.find((option) => (sortOrder || columnSortOption.order) === option.value);
        return {
          header: attribute.label,
          via: attribute.via,
          active: columnActive,
          width: ((1 - TITLE_COL_RATIO) / headerAttributes.length) * 100,
          keys: attribute.keys,
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

  getCategoryMaxCount = (categoryGroups, attribute) => {
    const isList = !!attribute.frameworkIds;
    const allCategories = categoryGroups.reduce((memo, group) => memo.concat(group.get('categories')),
      List(),);
    return allCategories.reduce(
      (countsMemo, cat) => {
        if (isList) {
          const maxAttribute = cat.get(attribute.totalByFw)
            && cat.get(attribute.totalByFw).reduce(
              (memo, attr) => Math.max(attr, memo),
              0,
            );
          return maxAttribute ? Math.max(maxAttribute, countsMemo) : countsMemo;
        }
        return cat.get(attribute.total) ? Math.max(cat.get(attribute.total), countsMemo) : countsMemo;
      },
      0,
    );
  };

  getCountAttributes = (taxonomy) => {
    // figure out if tagged directly or via child category
    const tagsRecs = this.getTagsTax(taxonomy, 'tags_recommendations');
    const tagsMeasures = this.getTagsTax(taxonomy, 'tags_measures');

    const attributes = [];
    if (tagsRecs) {
      attributes.push({
        total: 'recommendationsPublicCount',
        totalByFw: 'recommendationsPublicCountByFW',
        accepted: 'recommendationsAcceptedCount',
        acceptedByFw: 'recommendationsAcceptedCountByFW',
        entity: 'recommendations',
        frameworkIds:
          taxonomy.get('frameworkIds')
          && taxonomy.get('frameworkIds').toArray(),
      });
      if (!tagsMeasures) {
        attributes.push({
          total: 'measuresPublicCount',
          totalByFw: 'measuresPublicCountByFw',
          entity: 'measures',
          frameworkIds:
            taxonomy.get('frameworkIds')
            && taxonomy.get('frameworkIds').toArray(),
        });
      }
    }
    if (tagsMeasures) {
      attributes.push({
        total: 'measuresPublicCount',
        totalByFw: 'measuresPublicCountByFw',
        entity: 'measures',
      });
    }
    return attributes;
  }

  getListColumns = ({
    taxonomy,
    categoryGroups,
    userOnly,
  }) => {
    const countAttributes = this.getCountAttributes(taxonomy);
    // category title column
    const columns = [
      {
        type: 'title',
        width: (userOnly || !taxonomy || countAttributes.length === 0) ? 100 : TITLE_COL_RATIO * 100,
      },
    ];
    // add columns for associated recs and measures
    return (userOnly || !taxonomy)
      ? columns
      : columns.concat(
        countAttributes.map((attribute) => ({
          type: 'count',
          width: ((1 - TITLE_COL_RATIO) / countAttributes.length) * 100,
          maxCount: this.getCategoryMaxCount(categoryGroups, attribute),
          attribute,
        }))
      );
  };

  render() {
    const {
      taxonomy,
      categoryGroups,
      onPageLink,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
      userOnly,
      frameworks,
      frameworkId,
    } = this.props;

    const headerColumns = this.getListHeaderColumns({
      taxonomy,
      frameworkId,
      sortOptions,
      sortBy,
      sortOrder,
      onSort,
      userOnly,
      isGrouped: categoryGroups.size > 0 && !!taxonomy.get('parent'),
      frameworks,
    });

    const columns = this.getListColumns({
      taxonomy,
      categoryGroups,
      userOnly,
    });

    return (
      <Styled>
        <CategoryListHeader columns={headerColumns} />
        <CategoryListBody>
          {categoryGroups.valueSeq().toArray().map((group) => {
            if (group.get('categories')) {
              return (
                <span key={group.get('id')}>
                  {group.get('type') === 'categories' && group.get('categories').size > 0
                    && (
                      <GroupHeaderLink to={`/category/${group.get('id')}`}>
                        <GroupHeader>
                          {getCategoryTitle(group)}
                        </GroupHeader>
                      </GroupHeaderLink>
                    )
                  }
                  {group.get('categories').map((cat) => (
                    <CategoryListItem
                      key={cat.get('id')}
                      category={cat}
                      columns={columns}
                      onPageLink={onPageLink}
                      frameworks={frameworks}
                      frameworkId={frameworkId}
                    />
                  ))}
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
  frameworks: PropTypes.object,
  onPageLink: PropTypes.func,
  onSort: PropTypes.func,
  sortOptions: PropTypes.array,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  userOnly: PropTypes.bool,
  frameworkId: PropTypes.string,
};

CategoryListItems.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default CategoryListItems;
