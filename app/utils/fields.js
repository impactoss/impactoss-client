import { truncateText } from 'utils/string';
import { sortEntities, sortCategories } from 'utils/sort';
import { filterTaxonomies, getAcceptanceStatus } from 'utils/entities';
import { USER_ROLES, TEXT_TRUNCATE } from 'themes/config';

import appMessages from 'containers/App/messages';
import { PATHS } from 'containers/App/constants';

export const getIdField = (entity, isManager) => ({
  controlType: 'info',
  type: 'reference',
  value: entity.get('id'),
  large: true,
  isManager,
  label: appMessages.attributes.id,
});
export const getReferenceField = (entity, isManager, defaultToId) => {
  const value = defaultToId
    ? entity.getIn(['attributes', 'reference']) || entity.get('id')
    : entity.getIn(['attributes', 'reference']);
  if (!!value && value.trim().length > 0) {
    return ({
      controlType: 'info',
      type: 'reference',
      value,
      large: true,
      isManager,
    });
  }
  return false;
};
const getLinkAnchor = (url) => truncateText(url.replace(/^https?:\/\//i, ''), TEXT_TRUNCATE.LINK_FIELD);

export const getLinkField = (entity) => ({
  type: 'link',
  value: entity.getIn(['attributes', 'url']),
  anchor: getLinkAnchor(entity.getIn(['attributes', 'url'])),
});
export const getEntityLinkField = (entity, path, label, labelFormatted) => ({
  type: 'link',
  internal: true,
  value: `${path}/${entity.get('id')}`,
  anchor: entity.getIn(['attributes', 'title']) || entity.getIn(['attributes', 'name']),
  label,
  labelFormatted,
});

export const getTitleField = (entity, isManager, attribute = 'title', label) => ({
  type: 'title',
  value: entity.getIn(['attributes', attribute]),
  isManager,
  label,
});
export const getTitleTextField = (entity, isManager, attribute = 'title', label) => ({
  type: 'titleText',
  value: entity.getIn(['attributes', attribute]),
  isManager,
  label,
});
export const getStatusField = (entity, attribute = 'draft', options, label, defaultValue = true) => ({
  controlType: 'info',
  type: 'status',
  value: (
    entity
    && entity.getIn(['attributes', attribute]) !== null
    && typeof entity.getIn(['attributes', attribute]) !== 'undefined'
  )
    ? entity.getIn(['attributes', attribute])
    : defaultValue,
  options,
  label,
});

// only show the highest rated role (lower role ids means higher)
const getHighestUserRoleId = (roles) => roles.reduce((memo, role) => role.get('id') < memo ? role.get('id') : memo,
  USER_ROLES.DEFAULT.value);

export const getRoleField = (entity) => ({
  controlType: 'info',
  type: 'role',
  value: entity.get('roles') && getHighestUserRoleId(entity.get('roles')),
  options: Object.values(USER_ROLES),
});

export const getMetaField = (entity) => {
  const fields = [];
  if (entity.get('user') && entity.getIn(['user', 'attributes', 'name'])) {
    fields.push({
      label: appMessages.attributes.meta.updated_by,
      value: entity.get('user') && entity.getIn(['user', 'attributes', 'name']),
    });
  }
  fields.push({
    label: appMessages.attributes.meta.updated_at,
    value: entity.getIn(['attributes', 'updated_at']),
    date: true,
    time: true,
  });
  fields.push({
    label: appMessages.attributes.meta.created_at,
    value: entity.getIn(['attributes', 'created_at']),
    date: true,
  });
  return {
    controlType: 'info',
    type: 'meta',
    fields,
  };
};

export const getMarkdownField = (entity, attribute, hasLabel = true, label) => !!entity.getIn(['attributes', attribute])
  && (entity.getIn(['attributes', attribute]).trim().length > 0)
  && ({
    type: 'markdown',
    value: entity.getIn(['attributes', attribute]),
    label: hasLabel && (appMessages.attributes[label || attribute]),
  });

export const getDateField = (entity, attribute, showEmpty, emptyMessage) => (showEmpty || (
  !!entity.getIn(['attributes', attribute])
    && (entity.getIn(['attributes', attribute]).trim().length > 0)
))
  && ({
    type: 'date',
    value: !!entity.getIn(['attributes', attribute]) && entity.getIn(['attributes', attribute]),
    label: appMessages.attributes[attribute],
    showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
  });

export const getDateRelatedField = (value, attribute, showEmpty, emptyMessage) => (showEmpty || (!!value && (value.trim().length > 0)))
  && ({
    type: 'date',
    value: !!value && value,
    label: appMessages.attributes[attribute],
    showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
  });

export const getTextField = (entity, attribute) => !!entity.getIn(['attributes', attribute])
  && (entity.getIn(['attributes', attribute]).trim().length > 0)
  && ({
    type: 'text',
    value: entity.getIn(['attributes', attribute]),
    label: appMessages.attributes[attribute],
  });

const mapCategoryOptions = (categories, taxId) => categories
  ? sortCategories(categories, taxId)
    .map((cat) => ({
      label: cat.getIn(['attributes', 'title']),
      reference: cat.getIn(['attributes', 'reference']) || null,
      draft: cat.getIn(['attributes', 'draft']) || null,
      linkTo: `${PATHS.CATEGORIES}/${cat.get('id')}`,
    }))
    .valueSeq().toArray()
  : [];

const mapSmartCategoryOptions = (categories) => categories
  ? sortEntities(
    categories,
    'asc',
    'referenceThenTitle',
  )
    .map((cat) => ({
      label: cat.getIn(['attributes', 'title']),
      isSmart: cat.get('associated') && cat.get('associated').size > 0,
      reference: cat.getIn(['attributes', 'reference']) || null,
      draft: cat.getIn(['attributes', 'draft']) || null,
      linkTo: `${PATHS.CATEGORIES}/${cat.get('id')}`,
    }))
    .valueSeq().toArray()
  : [];

const mapReports = (reports) => reports
  ? reports.map((report) => ({
    label: report.getIn(['attributes', 'title']),
    dueDate: report.get('due_date') ? report.getIn(['due_date', 'attributes', 'due_date']) : null,
    updatedAt: report.getIn(['attributes', 'updated_at']),
    createdAt: report.getIn(['attributes', 'created_at']),
    draft: report.getIn(['attributes', 'draft']),
    linkTo: `${PATHS.PROGRESS_REPORTS}/${report.get('id')}`,
    updatedBy: report.get('user') && report.getIn(['user', 'attributes']).toJS(),
  })).valueSeq().toArray()
  : [];

export const getReportsField = (reports, button) => ({
  type: 'reports',
  values: reports && mapReports(reports),
  button: button || null,
  showEmpty: true,
});

const mapDates = (dates) => dates
  ? dates.map((date) => ({
    date: date.getIn(['attributes', 'due_date']),
    due: date.getIn(['attributes', 'due']),
    overdue: date.getIn(['attributes', 'overdue']),
  })).valueSeq().toArray()
  : [];

export const getScheduleField = (dates) => ({
  type: 'schedule',
  values: mapDates(dates),
});

export const getTaxonomyFields = (taxonomies) => taxonomies
  && sortEntities(
    taxonomies,
    'asc',
    'priority',
  ).map(
    (taxonomy) => ({
      type: 'taxonomy',
      label: appMessages.entities.taxonomies[taxonomy.get('id')].plural,
      entityType: 'taxonomies',
      id: taxonomy.get('id'),
      values: mapCategoryOptions(taxonomy.get('categories'), taxonomy.get('id')),
    })
  ).valueSeq().toArray();

export const getSmartTaxonomyField = (taxonomy) => ({
  type: 'smartTaxonomy',
  entityType: 'taxonomies',
  id: taxonomy.get('id'),
  values: mapSmartCategoryOptions(taxonomy.get('categories')),
});

export const hasTaxonomyCategories = (taxonomies) => taxonomies
  ? taxonomies.reduce((memo, taxonomy) => memo || (taxonomy.get('categories') && taxonomy.get('categories').size > 0), false)
  : false;

const getCategoryShortTitle = (category) => {
  const title = (
    category.getIn(['attributes', 'short_title'])
    && (category.getIn(['attributes', 'short_title']).trim().length > 0)
  )
    ? category.getIn(['attributes', 'short_title'])
    : category.getIn(['attributes', 'title']);
  return truncateText(title, TEXT_TRUNCATE.ENTITY_TAG);
};

export const getCategoryShortTitleField = (entity) => ({
  type: 'short_title',
  value: getCategoryShortTitle(entity),
  inverse: entity.getIn(['attributes', 'draft']),
  taxonomyId: entity.getIn(['attributes', 'taxonomy_id']),
});

const getConnectionField = ({
  entities,
  taxonomies,
  connections,
  connectionOptions,
  entityType,
  entityIcon,
  entityPath,
  onEntityClick,
}) => ({
  type: 'connections',
  values: entities.toList(),
  taxonomies,
  connections,
  entityType,
  entityIcon,
  entityPath: entityPath || entityType,
  onEntityClick,
  showEmpty: appMessages.entities[entityType].empty,
  connectionOptions: connectionOptions.map((option) => ({
    label: appMessages.entities[option].plural,
    path: option,
    clientPath: option === 'measures' ? 'actions' : option,
  })),
});

export const getIndicatorConnectionField = (entities, connections, onEntityClick) => getConnectionField({
  entities: sortEntities(entities, 'asc', 'reference'),
  taxonomies: null,
  connections,
  connectionOptions: ['measures', 'recommendations'],
  entityType: 'indicators',
  onEntityClick,
});

export const getRecommendationConnectionField = (
  entities,
  taxonomies,
  connections,
  onEntityClick,
  fwid, // framework id
  hasResponse,
) => getConnectionField({
  entities: sortEntities(entities, 'asc', 'reference'),
  taxonomies: filterTaxonomies(taxonomies, 'tags_recommendations'),
  connections,
  connectionOptions: ['measures', 'indicators'],
  entityType: fwid ? `recommendations_${fwid}` : 'recommendations',
  entityPath: 'recommendations',
  onEntityClick,
  entityIcon: (entity) => {
    if (!hasResponse) return null;
    const status = getAcceptanceStatus(entity);
    return status ? status.icon : null;
  },
});
export const getMeasureConnectionField = (entities, taxonomies, connections, onEntityClick) => getConnectionField({
  entities: sortEntities(entities, 'asc', 'id'),
  taxonomies: filterTaxonomies(taxonomies, 'tags_measures'),
  connections,
  connectionOptions: ['indicators', 'recommendations'],
  entityType: 'measures',
  entityPath: 'actions',
  onEntityClick,
});

const getConnectionGroupsField = ({
  entityGroups,
  groupedBy,
  taxonomies,
  connections,
  connectionOptions,
  entityType,
  entityIcon,
  entityPath,
  onEntityClick,
}) => ({
  type: 'connectionGroups',
  groups: entityGroups.toList(),
  groupedBy,
  taxonomies,
  connections,
  entityType,
  entityIcon,
  entityPath: entityPath || entityType,
  onEntityClick,
  showEmpty: appMessages.entities[entityType].empty,
  connectionOptions: connectionOptions.map((option) => ({
    label: appMessages.entities[option].plural,
    path: option,
    clientPath: option === 'measures' ? 'actions' : option,
  })),
});
export const getRecommendationConnectionGroupsField = (
  entityGroups,
  groupedBy,
  taxonomies,
  connections,
  onEntityClick,
  fwid, // framework id
  hasResponse,
) => getConnectionGroupsField({
  entityGroups,
  groupedBy,
  taxonomies: filterTaxonomies(taxonomies, 'tags_recommendations'),
  connections,
  connectionOptions: ['measures'],
  entityType: fwid ? `recommendations_${fwid}` : 'recommendations',
  entityPath: 'recommendations',
  onEntityClick,
  entityIcon: (entity) => {
    if (!hasResponse) return null;
    const status = getAcceptanceStatus(entity);
    return status ? status.icon : null;
  },
});
export const getMeasureConnectionGroupsField = (entityGroups, groupedBy, taxonomies, connections, onEntityClick) => getConnectionGroupsField({
  entityGroups,
  groupedBy,
  taxonomies: filterTaxonomies(taxonomies, 'tags_measures'),
  connections,
  connectionOptions: ['indicators', 'recommendations'],
  entityType: 'measures',
  entityPath: 'actions',
  onEntityClick,
});

export const getManagerField = (entity, messageLabel, messageEmpty) => ({
  label: messageLabel,
  type: 'manager',
  value: entity.get('manager') && entity.getIn(['manager', 'attributes', 'name']),
  showEmpty: messageEmpty,
});

export const getDownloadField = (entity, isManager) => ({
  type: 'download',
  value: entity.getIn(['attributes', 'document_url']),
  isManager,
  public: entity.getIn(['attributes', 'public']),
  showEmpty: appMessages.attributes.documentEmpty,
});

export const getEmailField = (entity) => ({
  type: 'email',
  value: entity.getIn(['attributes', 'email']),
});
