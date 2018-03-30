import { truncateText } from 'utils/string';
import { sortEntities } from 'utils/sort';
import { ACCEPTED_STATUSES, USER_ROLES, TEXT_TRUNCATE } from 'themes/config';
import { find, filter, reduce } from 'lodash/collection';

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
const getLinkAnchor = (url) =>
  truncateText(url.replace(/^https?:\/\//i, ''), TEXT_TRUNCATE.LINK_FIELD);

export const getLinkField = (entity) => ({
  type: 'link',
  value: entity.getIn(['attributes', 'url']),
  anchor: getLinkAnchor(entity.getIn(['attributes', 'url'])),
});
export const getEntityLinkField = (entity, path, label) => ({
  type: 'link',
  internal: true,
  value: `${path}/${entity.get('id')}`,
  anchor: entity.getIn(['attributes', 'title']) || entity.getIn(['attributes', 'name']),
  label,
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
export const getStatusField = (entity, attribute = 'draft', options, label) => ({
  controlType: 'info',
  type: 'status',
  value: entity ? entity.getIn(['attributes', attribute]) : true,
  options,
  label,
});

// only show the highest rated role (lower role ids means higher)
const getHighestUserRoleId = (roles) =>
roles.reduce((memo, role) =>
    role.get('id') < memo ? role.get('id') : memo
  , USER_ROLES.DEFAULT.value);

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

export const getMarkdownField = (entity, attribute, hasLabel = true) =>
  !!entity.getIn(['attributes', attribute]) &&
  (entity.getIn(['attributes', attribute]).trim().length > 0) &&
  ({
    type: 'markdown',
    value: entity.getIn(['attributes', attribute]),
    label: hasLabel && appMessages.attributes[attribute],
  });

export const getDateField = (entity, attribute, obsoleteAppMessages, showEmpty, emptyMessage) =>
  (showEmpty || (
    !!entity.getIn(['attributes', attribute]) &&
    (entity.getIn(['attributes', attribute]).trim().length > 0)
  )) &&
  ({
    type: 'date',
    value: !!entity.getIn(['attributes', attribute]) && entity.getIn(['attributes', attribute]),
    label: appMessages.attributes[attribute],
    showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
  });

export const getDateRelatedField = (value, attribute, obsoleteAppMessages, showEmpty, emptyMessage) =>
  (showEmpty || (!!value && (value.trim().length > 0))) &&
  ({
    type: 'date',
    value: !!value && value,
    label: appMessages.attributes[attribute],
    showEmpty: showEmpty && (emptyMessage || appMessages.attributes[`${attribute}_empty`]),
  });

export const getTextField = (entity, attribute) =>
  !!entity.getIn(['attributes', attribute]) &&
  (entity.getIn(['attributes', attribute]).trim().length > 0) &&
  ({
    type: 'text',
    value: entity.getIn(['attributes', attribute]),
    label: appMessages.attributes[attribute],
  });

const mapCategoryOptions = (categories) => categories
  ? sortEntities(
      categories,
      'asc',
      'referenceThenTitle',
    )
    .map((cat) => ({
      label: cat.getIn(['attributes', 'title']),
      reference: cat.getIn(['attributes', 'reference']) || null,
      draft: cat.getIn(['attributes', 'draft']) || null,
      linkTo: `${PATHS.CATEGORIES}/${cat.get('id')}`,
    }))
    .toArray()
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
    .toArray()
  : [];

const mapReports = (reports) => reports
  ? reports.map((report) => ({
    label: report.getIn(['attributes', 'title']),
    dueDate: report.get('due_date') ? report.getIn(['due_date', 'attributes', 'due_date']) : null,
    updatedAt: report.getIn(['attributes', 'updated_at']),
    createdAt: report.getIn(['attributes', 'created_at']),
    linkTo: `${PATHS.PROGRESS_REPORTS}/${report.get('id')}`,
    updatedBy: report.get('user') && report.getIn(['user', 'attributes']).toJS(),
  })).toArray()
  : [];

export const getReportsField = (reports, obsoleteAppMessages, button) => ({
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
  })).toArray()
  : [];

export const getScheduleField = (dates) => ({
  type: 'schedule',
  values: mapDates(dates),
});

export const getTaxonomyFields = (taxonomies) =>
  taxonomies && sortEntities(taxonomies, 'asc', 'priority').map((taxonomy) => ({
    type: 'taxonomy',
    label: appMessages.entities.taxonomies[taxonomy.get('id')].plural,
    entityType: 'taxonomies',
    id: taxonomy.get('id'),
    values: mapCategoryOptions(taxonomy.get('categories')),
  })).toArray();

export const getSmartTaxonomyField = (taxonomy) => ({
  type: 'smartTaxonomy',
  entityType: 'taxonomies',
  id: taxonomy.get('id'),
  values: mapSmartCategoryOptions(taxonomy.get('categories')),
});

export const hasTaxonomyCategories = (taxonomies) =>
  taxonomies
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

export const getIndicatorConnectionField = (entities, connections, obsoleteAppMessages, onEntityClick) =>
  getConnectionField({
    entities: sortEntities(entities, 'asc', 'reference'),
    taxonomies: null,
    connections,
    connectionOptions: ['measures', 'sdgtargets'],
    entityType: 'indicators',
    onEntityClick,
  });

export const getRecommendationConnectionField = (entities, taxonomies, connections, obsoleteAppMessages, onEntityClick) =>
  getConnectionField({
    entities: sortEntities(entities, 'asc', 'reference'),
    taxonomies: taxonomies && taxonomies.filter((tax) => tax.getIn(['attributes', 'tags_recommendations'])),
    connections,
    connectionOptions: ['measures'],
    entityType: 'recommendations',
    onEntityClick,
    entityIcon: (entity) => {
      const status = find(ACCEPTED_STATUSES,
        (option) => option.value === entity.getIn(['attributes', 'accepted'])
      );
      return status ? status.icon : null;
    },
  });

export const getSdgTargetConnectionField = (entities, taxonomies, connections, obsoleteAppMessages, onEntityClick) =>
  getConnectionField({
    entities: sortEntities(entities, 'asc', 'reference'),
    taxonomies: taxonomies && taxonomies.filter((tax) => tax.getIn(['attributes', 'tags_sdgtargets'])),
    connections,
    connectionOptions: ['indicators', 'measures'],
    entityType: 'sdgtargets',
    onEntityClick,
  });

export const getMeasureConnectionField = (entities, taxonomies, connections, obsoleteAppMessages, onEntityClick) =>
  getConnectionField({
    entities: sortEntities(entities, 'asc', 'id'),
    taxonomies: taxonomies && taxonomies.filter((tax) => tax.getIn(['attributes', 'tags_measures'])),
    connections,
    connectionOptions: ['indicators', 'recommendations', 'sdgtargets'],
    entityType: 'measures',
    entityPath: 'actions',
    onEntityClick,
  });

export const getManagerField = (entity, messageLabel, messageEmpty) =>
  ({
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

const getSectionFields = (shape, section, column, entity, associations, onEntityClick, hasUserRole) => {
  const sectionGroups = [];

  // SMART field
  if (shape.taxonomies
    && shape.taxonomies.smart
    && section === 'body'
    && column === 'main'
  ) {
    const smartTaxonomy = associations.taxonomies.find((tax) => tax.getIn(['attributes', 'is_smart']));
    if (smartTaxonomy) {
      sectionGroups.push({ // fieldGroup
        type: 'smartTaxonomy',
        label: appMessages.entities.taxonomies[smartTaxonomy.get('id')].plural,
        fields: [getSmartTaxonomyField(smartTaxonomy)],
      });
    }
  }

  // attribute fields
  const fields = filter(shape.fields, (field) =>
    field.section === section
    && field.column === column
    && !field.disabled
    && (typeof field.role === 'undefined' || hasUserRole[field.role])
  );

  const groupType = reduce(fields, (memo, field) =>
    field.groupType && (memo === '' || memo === field.groupType) ? field.groupType : null
  , '');
  let groupFields = [];
  // add id field in main header if not reference present
  if (section === 'header' && column === 'main' && !reduce(fields, (memo, field) =>
    memo || field.attribute === 'reference'
  , false)) {
    groupFields = groupFields.concat([getIdField(entity, hasUserRole[USER_ROLES.MANAGER.value])]);
  }
  groupFields = reduce(fields, (memo, field) => {
    if (field.control === 'title') {
      return memo.concat([getTitleField(entity, hasUserRole[USER_ROLES.MANAGER.value])]);
    }
    if (field.control === 'textarea') {
      return memo.concat([getTextField(entity, field.attribute)]);
    }
    if (field.control === 'status') {
      return memo.concat([getStatusField(entity)]);
    }
    if (field.control === 'date') {
      return memo.concat([getDateField(entity, field.attribute, null, true)]);
    }
    if (field.control === 'markdown') {
      return memo.concat([getMarkdownField(entity, field.attribute)]);
    }
    return memo;
  }, groupFields);
  // add id field in aside header if manager
  if (section === 'header' && column === 'aside' && hasUserRole[USER_ROLES.MANAGER.value]) {
    groupFields = groupFields.concat([getMetaField(entity)]);
  }
  if (groupFields && groupFields.length > 0) {
    sectionGroups.push({
      type: groupType,
      fields: groupFields,
    });
  }
  // taxonomy fields
  if (shape.taxonomies
    && shape.taxonomies.section === section
    && shape.taxonomies.column === column
    && associations
    && associations.taxonomies
  ) {
    const taxonomiesFiltered = shape.taxonomies.smart
      ? associations.taxonomies.filter((tax) => !tax.getIn(['attributes', 'is_smart']))
      : associations.taxonomies;
    const taxonomies = taxonomiesFiltered.map((tax) =>
      tax.set('categories', tax.get('categories').filter((cat) =>
        typeof cat.get('associated') === 'undefined' || (cat.get('associated') && cat.get('associated').size > 0)
      ))
    );

    if (hasTaxonomyCategories(taxonomies)) {
      sectionGroups.push({ // fieldGroup
        label: appMessages.entities.taxonomies.plural,
        icon: 'categories',
        fields: getTaxonomyFields(taxonomies),
      });
    }
  }

  // connection fields
  if (shape.connections
    && shape.connections.tables
    && shape.connections.section === section
    && shape.connections.column === column
    && associations
  ) {
    sectionGroups.push({
      label: appMessages.entities.connections.plural,
      icon: 'connections',
      fields: reduce(shape.connections.tables, (memo, table) => {
        if (table.table === 'recommendations' && associations.recommendations && associations.recTaxonomies && associations.recConnections) {
          return memo.concat([getRecommendationConnectionField(associations.recommendations, associations.recTaxonomies, associations.recConnections, null, onEntityClick)]);
        }
        if (table.table === 'sdgtargets' && associations.sdgtargets && associations.sdgtargetTaxonomies && associations.sdgtargetConnections) {
          return memo.concat([getSdgTargetConnectionField(associations.sdgtargets, associations.sdgtargetTaxonomies, associations.sdgtargetConnections, null, onEntityClick)]);
        }
        if (table.table === 'indicators' && associations.indicators && associations.indicatorConnections) {
          return memo.concat([getIndicatorConnectionField(associations.indicators, associations.indicatorConnections, null, onEntityClick)]);
        }
        return memo;
      }, []),
    });
  }
  return sectionGroups.length > 0 ? sectionGroups : null;
};

export const getFields = ({ entity, hasUserRole, associations, onEntityClick, shape }) => ({
  header: {
    main: getSectionFields(
      shape,
      'header',
      'main',
      entity,
      associations,
      onEntityClick,
      hasUserRole
    ),
    aside: getSectionFields(
      shape,
      'header',
      'aside',
      entity,
      associations,
      onEntityClick,
      hasUserRole
    ),
  },
  body: {
    main: getSectionFields(
      shape,
      'body',
      'main',
      entity,
      associations,
      onEntityClick,
      hasUserRole
    ),
    aside: getSectionFields(
      shape,
      'body',
      'aside',
      entity,
      associations,
      onEntityClick,
      hasUserRole
    ),
  },
});
