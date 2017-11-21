const getTaxonomyTagList = (taxonomy) => {
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
export const mapToTaxonomyList = (taxonomies, onLink, activeId, tags = false) => taxonomies.map((tax) => ({
  id: tax.get('id'),
  count: tax.count,
  onLink: () => onLink(`/categories/${tax.get('id')}`),
  tags: tags ? getTaxonomyTagList(tax) : null,
  active: parseInt(activeId, 10) === parseInt(tax.get('id'), 10),
})).toArray();

export const mapToCategoryList = (categories, onLink, countAttributes) =>
  categories.map((cat) => ({
    id: cat.get('id'),
    reference: cat.getIn(['attributes', 'reference']) && cat.getIn(['attributes', 'reference']).trim() !== ''
      ? cat.getIn(['attributes', 'reference'])
      : null,
    title: cat.getIn(['attributes', 'title']),
    draft: cat.getIn(['attributes', 'draft']),
    onLink: () => onLink(`/category/${cat.get('id')}`),
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
