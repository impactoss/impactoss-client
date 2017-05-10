import { reduce } from 'lodash/collection';

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
export const mapToTaxonomyList = (taxonomies, onLink, active, tags = true) => Object.values(taxonomies).map((tax) => ({
  id: tax.id,
  count: tax.count,
  onLink: () => onLink(`/categories/${tax.id}`),
  tags: tags ? getTaxonomyTagList(tax) : null,
  active: active === tax.id,
}));

export const getCategoryMaxCount = (categories, attribute) =>
  reduce(categories, (countsMemo, cat) => {
    if (cat[attribute]) {
      return cat[attribute] > countsMemo
        ? cat[attribute]
        : countsMemo;
    }
    return countsMemo;
  }, 0);


export const mapToCategoryList = (categories, onLink, countAttributes) => Object.values(categories).map((cat) => ({
  id: cat.id,
  title: cat.attributes.title,
  onLink: () => onLink(`/category/${cat.id}`),
  counts: countAttributes
    ? countAttributes.map((countAttribute) => cat[countAttribute.attribute])
    : null,
}));
