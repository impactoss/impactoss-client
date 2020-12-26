import { PATHS } from 'containers/App/constants';
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
  return tags;
};

export const prepareTaxonomyGroups = (taxonomies, activeId, onLink, onMouseOver) => {
  const parentTaxonomies = taxonomies.filter((tax) =>
    tax.getIn(['attributes', 'parent_id']) === ''
    || tax.getIn(['attributes', 'parent_id']) === null
  );
  return [({
    id: 1,
    taxonomies: parentTaxonomies.map((tax) => {
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
  })];
};

export const getDefaultTaxonomy = (taxonomies, frameworkId) =>
  taxonomies
    .filter((tax) =>
      attributesEqual(tax.getIn(['attributes', 'framework_id']), frameworkId))
    .reduce((memo, tax) => {
      if (memo) {
        const priority = tax.getIn(['attributes', 'priority']);
        if (priority && priority < memo.getIn(['attributes', 'priority'])) {
          return tax;
        }
        return memo;
      }
      return tax;
    }, null);

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
