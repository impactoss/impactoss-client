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

const mapTaxonomy = (tax, childTaxonomies, activeId, onLink) => {
  const children = childTaxonomies.filter((t) =>
    attributesEqual(t.getIn(['attributes', 'parent_id']), tax.get('id'))
  );
  return ({
    id: tax.get('id'),
    count: tax.count,
    onLink: (isActive = false) => onLink(isActive ? PATHS.OVERVIEW : `${PATHS.TAXONOMIES}/${tax.get('id')}`),
    active: parseInt(activeId, 10) === parseInt(tax.get('id'), 10),
    children: children && children.map((child) => ({
      id: child.get('id'),
      child: true,
      count: child.count,
      onLink: (isActive = false) => onLink(isActive ? PATHS.OVERVIEW : `${PATHS.TAXONOMIES}/${child.get('id')}`),
      active: parseInt(activeId, 10) === parseInt(child.get('id'), 10),
    })),
  });
};

export const prepareTaxonomyGroups = (
  taxonomies,
  activeId,
  onLink,
  frameworkId,
  frameworks,
) => {
  const parentTaxonomies = taxonomies.filter((tax) =>
    tax.getIn(['attributes', 'parent_id']) === ''
    || tax.getIn(['attributes', 'parent_id']) === null
  );
  const childTaxonomies = taxonomies.filter((tax) =>
    !!tax.getIn(['attributes', 'parent_id'])
  );
  const groups = [];
  if (frameworkId && frameworkId !== 'all') {
    // single framework mode
    groups.push({
      id: frameworkId,
      frameworkId,
      taxonomies: parentTaxonomies
        .filter((tax) => tax.get('frameworkIds').find((fw) => attributesEqual(fw, frameworkId)))
        .map((tax) => mapTaxonomy(tax, childTaxonomies, activeId, onLink))
        .toList()
        .toJS(),
    });
  } else {
    // multi-framework mode
    // exclusive taxonomies (one framework only)
    frameworks.forEach((fw) => {
      const fwTaxonomies = parentTaxonomies
        .filter((tax) => {
          const taxFwIds = tax.get('frameworkIds');
          return tax.getIn(['attributes', 'tags_recommendations']) &&
            taxFwIds.size === 1 &&
            taxFwIds.find((fwid) => attributesEqual(fwid, fw.get('id')));
        })
        .map((tax) => mapTaxonomy(tax, childTaxonomies, activeId, onLink))
        .toList()
        .toJS();
      if (fwTaxonomies && fwTaxonomies.length > 0) {
        groups.push({
          id: fw.get('id'),
          frameworkId: fw.get('id'),
          taxonomies: fwTaxonomies,
        });
      }
    });
    // common frameworks
    groups.push({
      id: 'common',
      taxonomies: parentTaxonomies
        .filter((tax) =>
          tax.getIn(['attributes', 'tags_recommendations']) &&
          tax.get('frameworkIds').size > 1
        )
        .map((tax) => mapTaxonomy(tax, childTaxonomies, activeId, onLink))
        .toList()
        .toJS(),
    });
  }

  const measureOnlyTaxonomies = parentTaxonomies
    .filter((tax) =>
      tax.getIn(['attributes', 'tags_measures']) &&
      !tax.getIn(['attributes', 'tags_recommendations'])
    );
  if (measureOnlyTaxonomies && measureOnlyTaxonomies.size > 0) {
    groups.push({
      id: 'measures',
      taxonomies: measureOnlyTaxonomies
        .map((tax) => mapTaxonomy(tax, taxonomies, activeId, onLink))
        .toList()
        .toJS(),
    });
  }
  return groups;
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
