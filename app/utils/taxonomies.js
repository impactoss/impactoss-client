export const getTaxonomyTagList = (taxonomy) => {
  const tags = [];
  if (taxonomy.attributes.tags_recommendations) {
    tags.push({
      type: 'recommendations',
      icon: 'recommendations',
    });
  }
  if (taxonomy.attributes.tags_measures) {
    tags.push({
      type: 'measures',
      icon: 'actions',
    });
  }
  return tags;
};
export const mapToTaxonomyList = (taxonomies, onLink) => Object.values(taxonomies).map((tax) => ({
  id: tax.id,
  count: tax.count,
  onLink: () => onLink(`/categories/${tax.id}`),
  tags: getTaxonomyTagList(tax),
}));
