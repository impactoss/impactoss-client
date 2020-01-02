import { PATHS } from 'containers/App/constants';
import { map } from 'lodash/collection';
import { TAXONOMY_GROUPS } from 'themes/config';
import { attributesEqual } from 'utils/entities';

export const getTaxonomyTagList = (taxonomy) => {
  const tags = [];
  if (taxonomy.getIn(['attributes', 'tags_measures'])) {
    tags.push({
      type: 'measures',
      icon: 'actions',
    });
  }
  if (taxonomy.getIn(['attributes', 'tags_recommendations'])) {
    tags.push({
      type: 'recommendations',
      icon: 'recommendations',
    });
  }
  if (taxonomy.getIn(['attributes', 'tags_sdgtargets'])) {
    tags.push({
      type: 'sdgtargets',
      icon: 'sdgtargets',
    });
  }
  return tags;
};

export const prepareTaxonomyGroups = (taxonomies, activeId, onLink, onMouseOver) => {
  const parentTaxnomies = taxonomies.filter((tax) =>
    tax.getIn(['attributes', 'parent_id']) === ''
    || tax.getIn(['attributes', 'parent_id']) === null
  );
  return map(TAXONOMY_GROUPS, (taxGroup) => {
    const groupTaxonomies = parentTaxnomies.filter((tax) => {
      const priority = tax.getIn(['attributes', 'priority']);
      return priority
        ? priority <= taxGroup.priorityMax
          && priority >= taxGroup.priorityMin
        : taxGroup.default;
    });
    return ({
      id: taxGroup.id,
      taxonomies: groupTaxonomies.map((tax) => {
        const children = taxonomies.filter((t) =>
          attributesEqual(t.getIn(['attributes', 'parent_id']), tax.get('id'))
        );
        return ({
          id: tax.get('id'),
          count: tax.count,
          onLink: (isActive = false) => onLink(isActive ? PATHS.OVERVIEW : `${PATHS.TAXONOMIES}/${tax.get('id')}`),
          onMouseOver: (isOver = true) => onMouseOver && onMouseOver(tax.get('id'), isOver),
          active: parseInt(activeId, 10) === parseInt(tax.get('id'), 10),
          children: children && children.map((child) => ({
            id: child.get('id'),
            child: true,
            count: child.count,
            onLink: (isActive = false) => onLink(isActive ? PATHS.OVERVIEW : `${PATHS.TAXONOMIES}/${child.get('id')}`),
            onMouseOver: (isOver = true) => onMouseOver && onMouseOver(child.get('id'), isOver),
            active: parseInt(activeId, 10) === parseInt(child.get('id'), 10),
          })).toArray(),
        });
      }).toArray(),
    });
  });
};

export const getDefaultTaxonomy = (taxonomies) => {
  const taxGroup = TAXONOMY_GROUPS[0];
  return taxonomies.reduce((memo, tax) => {
    if (memo) {
      const priority = tax.getIn(['attributes', 'priority']);
      if (priority
        && priority <= taxGroup.priorityMax
        && priority >= taxGroup.priorityMin
        && priority < memo.getIn(['attributes', 'priority'])) {
        return tax;
      }
      return memo;
    }
    return tax;
  }, null);
};

export const mapToCategoryList = (categories, onLink, countAttributes) =>
  categories.map((cat) => ({
    id: cat.get('id'),
    reference: cat.getIn(['attributes', 'reference']) && cat.getIn(['attributes', 'reference']).trim() !== ''
      ? cat.getIn(['attributes', 'reference'])
      : null,
    title: cat.getIn(['attributes', 'title']),
    draft: cat.getIn(['attributes', 'draft']),
    onLink: () => onLink(`${PATHS.CATEGORIES}/${cat.get('id')}`),
    counts: countAttributes
      ? countAttributes.map((countAttribute) => ({
        total: cat.get(countAttribute.total),
        public: cat.get(countAttribute.public),
        draft: cat.get(countAttribute.total) - cat.get(countAttribute.public),
        accepted: countAttribute.accepted ? cat.get(countAttribute.accepted) : null,
        noted: countAttribute.accepted ? (cat.get(countAttribute.public) - cat.get(countAttribute.accepted)) : null,
      }))
      : null,
  })).toArray();
