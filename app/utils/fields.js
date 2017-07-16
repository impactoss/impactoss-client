export const getIdField = (entity) => ({
  type: 'reference',
  value: entity.get('id'),
  large: true,
});
export const getReferenceField = (entity) =>
  !!entity.getIn(['attributes', 'reference']) &&
  (entity.getIn(['attributes', 'reference']).trim().length > 0) &&
  ({
    type: 'reference',
    value: entity.getIn(['attributes', 'reference']),
    large: true,
  });
const getLinkAnchor = (url) => {
  const urlNoProtocol = url.replace(/^https?:\/\//i, '');
  return urlNoProtocol.length > 40
    ? `${urlNoProtocol.substring(0, 40)}...`
    : urlNoProtocol;
};
export const getLinkField = (entity) => ({
  type: 'link',
  value: entity.getIn(['attributes', 'url']),
  anchor: getLinkAnchor(entity.getIn(['attributes', 'url'])),
});
export const getTitleField = (entity, isManager) => ({
  type: 'title',
  value: entity.getIn(['attributes', 'title']),
  isManager,
});
export const getStatusField = (entity) => ({
  type: 'status',
  value: entity.getIn(['attributes', 'draft']),
});
export const getMetaField = (entity, formatMessage, appMessages, formatDate) => ({
  type: 'meta',
  fields: [
    {
      label: formatMessage(appMessages.attributes.meta.updated_at),
      value: formatDate(new Date(entity.getIn(['attributes', 'updated_at']))),
    },
    {
      label: formatMessage(appMessages.attributes.meta.updated_by),
      value: entity.get('user') && entity.get(['user', 'attributes', 'name']),
    },
  ],
});

export const getMarkdownField = (entity, attribute, hasLabel, formatMessage, appMessages) =>
  !!entity.getIn(['attributes', attribute]) &&
  (entity.getIn(['attributes', attribute]).trim().length > 0) &&
  ({
    type: 'markdown',
    value: entity.getIn(['attributes', attribute]),
    label: hasLabel && formatMessage(appMessages.attributes[attribute]),
  });

export const getDateField = (entity, attribute, formatMessage, appMessages, formatDate, showEmpty) =>
  (showEmpty || (
    !!entity.getIn(['attributes', attribute]) &&
    (entity.getIn(['attributes', attribute]).trim().length > 0)
  )) &&
  ({
    type: 'date',
    value: entity.getIn(['attributes', attribute]) && formatDate(new Date(entity.getIn(['attributes', attribute]))),
    label: formatMessage(appMessages.attributes[attribute]),
    showEmpty: showEmpty && formatMessage(appMessages.attributes[`${attribute}_empty`]),
  });

export const getTextField = (entity, attribute, formatMessage, appMessages) =>
  !!entity.getIn(['attributes', attribute]) &&
  (entity.getIn(['attributes', attribute]).trim().length > 0) &&
  ({
    type: 'text',
    value: entity.getIn(['attributes', attribute]),
    label: formatMessage(appMessages.attributes[attribute]),
  });

const mapCategoryOptions = (categories) => categories
  ? categories.map((cat) => ({
    label: cat.getIn(['attributes', 'title']),
    linkTo: `/category/${cat.get('id')}`,
  })).toArray()
  : [];

export const getTaxonomyFields = (taxonomies, formatMessage, appMessages) =>
  taxonomies && taxonomies.map((taxonomy) => ({
    type: 'list',
    label: formatMessage(appMessages.entities.taxonomies[taxonomy.get('id')].plural),
    entityType: 'taxonomies',
    id: taxonomy.get('id'),
    values: mapCategoryOptions(taxonomy.get('categories')),
  })).toArray();

const getCategoryShortTitle = (category) => {
  const title = (
    category.getIn(['attributes', 'short_title'])
    && (category.getIn(['attributes', 'short_title']).trim().length > 0)
  )
    ? category.getIn(['attributes', 'short_title'])
    : category.getIn(['attributes', 'title']);
  return title.length > 10
    ? `${title.substring(0, 10)}...`
    : title;
};

export const getCategoryShortTitleField = (entity) => ({
  type: 'short_title',
  value: getCategoryShortTitle(entity),
  taxonomyId: entity.getIn(['attributes', 'taxonomy_id']),
});

const getConnectionField = ({
  entities,
  taxonomies,
  connectionOptions,
  entityType,
  icon,
  entityPath,
  formatMessage,
  appMessages,
  onEntityClick,
}) => ({
  type: 'connections',
  values: entities.toList(),
  taxonomies,
  entityType,
  icon: icon || entityType,
  entityPath: entityPath || entityType,
  onEntityClick,
  showEmpty: formatMessage(appMessages.entities[entityType].empty),
  connectionOptions: connectionOptions.map((option) => ({
    label: formatMessage(appMessages.entities[option].plural),
    path: option,
  })),
  label: `${entities.size} ${formatMessage(entities.size === 1
    ? appMessages.entities[entityType].single
    : appMessages.entities[entityType].plural
  )}`,
});

export const getIndicatorConnectionField = (entities, formatMessage, appMessages, onEntityClick) =>
  getConnectionField({
    entities,
    taxonomies: null,
    connectionOptions: ['measures', 'sdgtargets'],
    entityType: 'indicators',
    formatMessage,
    appMessages,
    onEntityClick,
  });

export const getRecommendationConnectionField = (entities, taxonomies, formatMessage, appMessages, onEntityClick) =>
  getConnectionField({
    entities,
    taxonomies,
    connectionOptions: ['measures'],
    entityType: 'recommendations',
    formatMessage,
    appMessages,
    onEntityClick,
  });

export const getSdgTargetConnectionField = (entities, taxonomies, formatMessage, appMessages, onEntityClick) =>
  getConnectionField({
    entities,
    taxonomies,
    connectionOptions: ['indicators', 'measures'],
    entityType: 'sdgtargets',
    formatMessage,
    appMessages,
    onEntityClick,
  });

export const getMeasureConnectionField = (entities, taxonomies, formatMessage, appMessages, onEntityClick) =>
  getConnectionField({
    entities,
    taxonomies,
    connectionOptions: ['indicators', 'recommendations', 'sdgtargets'],
    entityType: 'measures',
    entityPath: 'actions',
    formatMessage,
    appMessages,
    onEntityClick,
  });

export const getManagerField = (entity, formatMessage, messageLabel, messageEmpty) =>
  ({
    label: formatMessage(messageLabel),
    type: 'manager',
    value: entity.get('manager') && entity.getIn(['manager', 'attributes', 'name']),
    showEmpty: formatMessage(messageEmpty),
  });
