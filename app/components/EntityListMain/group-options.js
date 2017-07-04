export const makeGroupOptions = (taxonomies, connectedTaxonomies) => {
  let options = [];

  // taxonomy options
  if (taxonomies) {
    // first prepare taxonomy options
    options = options.concat(Object.values(taxonomies).map((taxonomy) => ({
      value: taxonomy.id, // filterOptionId
      label: taxonomy.attributes.title,
    })));
  }
  // connectedTaxonomies options
  if (connectedTaxonomies) {
    // first prepare taxonomy options
    options = options.concat(Object.values(connectedTaxonomies).map((taxonomy) => ({
      value: `x:${taxonomy.id}`, // filterOptionId
      label: taxonomy.attributes.title,
    })));
  }
  return options;
};
