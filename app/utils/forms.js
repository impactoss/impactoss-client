import { Map, List } from 'immutable';
import {
  getEntityTitle,
  getEntityReference,
  getCategoryShortTitle,
} from 'utils/entities';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';
import validateDateFormat from 'components/forms/validators/validate-date-format';
import validateRequired from 'components/forms/validators/validate-required';
import validateNumber from 'components/forms/validators/validate-number';

import {
  PUBLISH_STATUSES,
  REPORT_FREQUENCIES,
  ACCEPTED_STATUSES,
  DOC_PUBLISH_STATUSES,
} from 'containers/App/constants';

export const entityOption = (entity, defaultToId, hasTags) => Map({
  value: entity.get('id'),
  label: getEntityTitle(entity),
  reference: getEntityReference(entity, defaultToId),
  checked: !!entity.get('associated'),
  tags: hasTags && entity.get('categories'),
});

export const entityOptions = (entities, defaultToId = true, hasTags = true) => entities
  ? entities.toList().map((entity) => entityOption(entity, defaultToId, hasTags))
  : List();

export const userOption = (entity, activeUserId) => Map({
  value: entity.get('id'),
  label: entity.getIn(['attributes', 'name']),
  checked: activeUserId ? entity.get('id') === activeUserId.toString() : false,
});

export const userOptions = (entities, activeUserId) => entities
  ? entities.reduce((options, entity) =>
    options.push(userOption(entity, activeUserId)), List())
  : List();

export const dateOption = (entity, activeDateId) => Map({
  value: entity.get('id'),
  label: entity.getIn(['attributes', 'due_date']),
  checked: activeDateId ? entity.get('id') === activeDateId.toString() : false,
});

// export const dateOptions = (entities, activeDateId) => entities
//   ? entities.reduce((options, entity) => {
//     // only allow active and those that are not associated
//     if ((entity.has('reportCount') && entity.get('reportCount') === 0)
//     || (activeDateId ? activeDateId.toString() === entity.get('id') : false)) {
//       return options.push(dateOption(entity, activeDateId));
//     }
//     return options;
//   }, List())
//   : List();

export const taxonomyOptions = (taxonomies) => taxonomies
  ? taxonomies.reduce((values, tax) =>
    values.set(tax.get('id'), entityOptions(tax.get('categories'), false, false)), Map())
  : Map();


// turn taxonomies into multiselect options
export const makeTagFilterGroups = (taxonomies) =>
  taxonomies && taxonomies.map((taxonomy) => ({
    title: taxonomy.getIn(['attributes', 'title']),
    palette: ['taxonomies', parseInt(taxonomy.get('id'), 10)],
    options: taxonomy.get('categories').map((category) => ({
      reference: getEntityReference(category, false),
      label: getEntityTitle(category),
      filterLabel: getCategoryShortTitle(category),
      showCount: false,
      value: category.get('id'),
    })).toList().toArray(),
  })).toList().toArray();

export const renderMeasureControl = (entities, taxonomies, onCreateOption) => entities
? {
  id: 'actions',
  model: '.associatedMeasures',
  dataPath: ['associatedMeasures'],
  label: 'Actions',
  controlType: 'multiselect',
  options: entityOptions(entities, true),
  advanced: true,
  selectAll: true,
  tagFilterGroups: makeTagFilterGroups(taxonomies),
  onCreate: onCreateOption
    ? () => onCreateOption({ path: 'measures' })
    : null,
}
: null;

export const renderSdgTargetControl = (entities, taxonomies, onCreateOption) => entities
? {
  id: 'sdgtargets',
  model: '.associatedSdgTargets',
  dataPath: ['associatedSdgTargets'],
  label: 'SDG targets',
  controlType: 'multiselect',
  options: entityOptions(entities, true),
  advanced: true,
  selectAll: true,
  tagFilterGroups: makeTagFilterGroups(taxonomies),
  onCreate: onCreateOption
    ? () => onCreateOption({ path: 'sdgtargets' })
    : null,
}
: null;


export const renderRecommendationControl = (entities, taxonomies, onCreateOption) => entities
? {
  id: 'recommendations',
  model: '.associatedRecommendations',
  dataPath: ['associatedRecommendations'],
  label: 'Recommendations',
  controlType: 'multiselect',
  options: entityOptions(entities),
  advanced: true,
  selectAll: true,
  tagFilterGroups: makeTagFilterGroups(taxonomies),
  onCreate: onCreateOption
    ? () => onCreateOption({ path: 'recommendations' })
    : null,
}
: null;

export const renderIndicatorControl = (entities, onCreateOption) => entities
? {
  id: 'indicators',
  model: '.associatedIndicators',
  dataPath: ['associatedIndicators'],
  label: 'Indicators',
  controlType: 'multiselect',
  options: entityOptions(entities, true),
  advanced: true,
  selectAll: true,
  onCreate: onCreateOption
    ? () => onCreateOption({ path: 'indicators' })
    : null,
}
: null;

export const renderUserControl = (entities, label, activeUserId) => entities
? {
  id: 'users',
  model: '.associatedUser',
  dataPath: ['associatedUser'],
  label,
  controlType: 'multiselect',
  multiple: false,
  options: userOptions(entities, activeUserId),
}
: null;

export const renderTaxonomyControl = (taxonomies, onCreateOption) => taxonomies
? taxonomies.reduce((controls, taxonomy) => controls.concat({
  id: taxonomy.get('id'),
  model: `.associatedTaxonomies.${taxonomy.get('id')}`,
  dataPath: ['associatedTaxonomies', taxonomy.get('id')],
  label: taxonomy.getIn(['attributes', 'title']),
  controlType: 'multiselect',
  multiple: taxonomy.getIn(['attributes', 'allow_multiple']),
  options: entityOptions(taxonomy.get('categories'), false),
  onCreate: onCreateOption
    ? () => onCreateOption({
      path: 'categories',
      attributes: { taxonomy_id: taxonomy.get('id') },
    })
    : null,
}), [])
: [];

const getAssociatedCategories = (taxonomy) => taxonomy.get('categories')
  ? getAssociatedEntities(taxonomy.get('categories'))
  : Map();

const getAssociatedEntities = (entities) =>
  entities.reduce((entitiesAssociated, entity) => entity.get('associated')
    ? entitiesAssociated.set(entity.get('id'), entity.getIn(['associated', 'id']))
    : entitiesAssociated
  , Map());

export const getCategoryUpdatesFromFormData = ({ formData, taxonomies, createKey }) =>
  taxonomies.reduce((updates, tax, taxId) => {
    const formCategoryIds = getCheckedValuesFromOptions(formData.getIn(['associatedTaxonomies', taxId]));

    // store associated cats as { [cat.id]: [association.id], ... }
    // then we can use keys for creating new associations and values for deleting
    const associatedCategories = getAssociatedCategories(tax);

    return Map({
      delete: updates.get('delete').concat(associatedCategories.reduce((associatedIds, associatedId, catId) =>
        !formCategoryIds.includes(catId)
          ? associatedIds.push(associatedId)
          : associatedIds
      , List())),
      create: updates.get('create').concat(formCategoryIds.reduce((payloads, catId) =>
        !associatedCategories.has(catId)
          ? payloads.push(Map({
            category_id: catId,
            [createKey]: formData.get('id'),
          }))
          : payloads
      , List())),
    });
  }, Map({ delete: List(), create: List() }));

export const getConnectionUpdatesFromFormData = ({ formData, connections, connectionAttribute, createConnectionKey, createKey }) => {
  const formConnectionIds = getCheckedValuesFromOptions(formData.get(connectionAttribute));
  // store associated Actions as { [action.id]: [association.id], ... }
  const associatedConnections = getAssociatedEntities(connections);

  return Map({
    delete: associatedConnections.reduce((associatedIds, associatedId, id) =>
      !formConnectionIds.includes(id)
        ? associatedIds.push(associatedId)
        : associatedIds
    , List()),
    create: formConnectionIds.reduce((payloads, id) =>
      !associatedConnections.has(id)
        ? payloads.push(Map({
          [createConnectionKey]: id,
          [createKey]: formData.get('id'),
        }))
        : payloads
    , List()),
  });
};


// only show the highest rated role (lower role ids means higher)
export const getHighestUserRoleId = (roles) =>
  roles.reduce((currentHighestRoleId, role) =>
    role.get('associated') && parseInt(role.get('id'), 10) < currentHighestRoleId
      ? parseInt(role.get('id'), 10)
      : currentHighestRoleId
  , 99999);

const getRoleOptions = (roles, formatMessage, appMessages) => {
  const roleOptions = [{
    value: 0,
    label: formatMessage(appMessages.entities.roles.defaultRole),
  }];
  return roles.reduce((memo, role) => memo.concat([{
    value: parseInt(role.get('id'), 10),
    label: role.getIn(['attributes', 'friendly_name']),
  }]), roleOptions);
};

export const getRoleFormField = (formatMessage, appMessages, roles) => ({
  id: 'role',
  controlType: 'select',
  model: '.associatedRole',
  label: formatMessage(appMessages.entities.roles.single),
  value: getHighestUserRoleId(roles),
  options: getRoleOptions(roles, formatMessage, appMessages),
});

export const getAcceptedField = (formatMessage, appMessages, entity) => ({
  id: 'accepted',
  controlType: 'select',
  model: '.attributes.accepted',
  label: formatMessage(appMessages.attributes.accepted),
  value: entity ? entity.getIn(['attributes', 'accepted']) : true,
  options: ACCEPTED_STATUSES,
});

export const getFrequencyField = (formatMessage, appMessages, entity) => ({
  id: 'frequency_months',
  controlType: 'select',
  model: '.attributes.frequency_months',
  label: formatMessage(appMessages.attributes.frequency_months),
  value: entity ? parseInt(entity.getIn(['attributes', 'frequency_months']), 10) : 1,
  options: REPORT_FREQUENCIES,
});

export const getDocumentStatusField = (formatMessage, appMessages, entity) => ({
  id: 'document_public',
  controlType: 'select',
  model: '.attributes.document_public',
  label: formatMessage(appMessages.attributes.document_public),
  value: entity ? entity.getIn(['attributes', 'document_public']) : false,
  options: DOC_PUBLISH_STATUSES,
});

export const getStatusField = (formatMessage, appMessages, entity) => ({
  id: 'status',
  controlType: 'select',
  model: '.attributes.draft',
  label: formatMessage(appMessages.attributes.draft),
  value: entity ? entity.getIn(['attributes', 'draft']) : true,
  options: PUBLISH_STATUSES,
});

const getDueDateDateOptions = (dates, activeDateId, formatMessage, appMessages, formatDate) => {
  const dateOptions = [
    {
      value: '0',
      label: formatMessage(appMessages.entities.progress_reports.unscheduled_short),
      checked: activeDateId === null || activeDateId === '0' || activeDateId === '',
    },
  ];
  const NO_OF_REPORT_OPTIONS = 1;
  let excludeCount = 0;
  return dates && dates.reduce((memo, date, i) => {
    const dateActive = activeDateId ? date.get('id') === activeDateId : false;
    const optionNoNotExceeded = i - excludeCount < NO_OF_REPORT_OPTIONS;
    const withoutReport = !date.getIn(['attributes', 'has_progress_report']);
    // only allow upcoming and those that are not associated
    if ((optionNoNotExceeded && withoutReport) || dateActive) {
      if (date.getIn(['attributes', 'overdue']) || dateActive) {
        excludeCount += 1;
      }
      // exclude overdue and already assigned date from max no of date options
      const label =
        `${formatDate(new Date(date.getIn(['attributes', 'due_date'])))} ${
          date.getIn(['attributes', 'overdue']) ? formatMessage(appMessages.entities.due_dates.overdue) : ''} ${
          date.getIn(['attributes', 'due']) ? formatMessage(appMessages.entities.due_dates.due) : ''}`;
      return memo.concat([
        {
          value: date.get('id'),
          label,
          highlight: date.getIn(['attributes', 'overdue']),
          checked: activeDateId ? date.get('id') === activeDateId : false,
        },
      ]);
    }
    excludeCount += 1;
    return memo;
  }, dateOptions);
};

export const getDueDateOptionsField = (formatMessage, appMessages, formatDate, dates, activeDateId) => ({
  id: 'due_date_id',
  controlType: 'radio',
  model: '.attributes.due_date_id',
  options: getDueDateDateOptions(
    dates,
    activeDateId || '0',
    formatMessage, appMessages, formatDate),
  value: activeDateId || '0',
  hints: {
    1: formatMessage(appMessages.entities.due_dates.empty),
  },
});

export const getTitleFormField = (formatMessage, appMessages, controlType = 'title', attribute = 'title') =>
  getFormField(formatMessage, appMessages, controlType, attribute, true);

export const getReferenceFormField = (formatMessage, appMessages, required = false, isAutoReference = false) =>
  getFormField(
    formatMessage,
    appMessages,
    'short',
    'reference',
    required,
    required ? 'reference' : 'referenceOptional',
    'reference',
    isAutoReference ? formatMessage(appMessages.hints.autoReference) : null
  );

export const getShortTitleFormField = (formatMessage, appMessages) =>
  getFormField(formatMessage, appMessages, 'short', 'short_title');

export const getMenuTitleFormField = (formatMessage, appMessages) =>
  getFormField(formatMessage, appMessages, 'short', 'menu_title', true); // required

export const getMenuOrderFormField = (formatMessage, appMessages) => {
  const field = getFormField(formatMessage, appMessages, 'short', 'order', false); // required
  field.validators.number = validateNumber;
  field.errorMessages.number = formatMessage(appMessages.forms.numberError);
  return field;
};

export const getMarkdownField = (formatMessage, appMessages, attribute = 'description') =>
  getFormField(formatMessage, appMessages, 'markdown', attribute);

export const getTextareaField = (formatMessage, appMessages, attribute = 'description') =>
  getFormField(formatMessage, appMessages, 'textarea', attribute);

export const getDateField = (formatMessage, appMessages, attribute, required = false, label) => {
  const field = getFormField(formatMessage, appMessages, 'date', attribute, required, label, 'date');
  field.validators.date = validateDateFormat;
  field.errorMessages.date = formatMessage(appMessages.forms.dateFormatError);
  return field;
};

export const getCheckboxField = (formatMessage, appMessages, attribute, entity, onChange) => (
  {
    id: attribute,
    controlType: 'checkbox',
    model: `.attributes.${attribute}`,
    label: appMessages.attributes[attribute] && formatMessage(appMessages.attributes[attribute]),
    value: entity && entity.getIn(['attributes', attribute]) ? entity.getIn(['attributes', attribute]) : false,
    changeAction: onChange,
  });

export const getUploadField = (formatMessage, appMessages) =>
  getFormField(formatMessage, appMessages, 'uploader', 'document_url', false, 'document_url', 'url');

export const getEmailField = (formatMessage, appMessages) =>
  getFormField(formatMessage, appMessages, 'email', 'email', true);

export const getFormField = (formatMessage, appMessages, controlType, attribute, required, label, placeholder, hint) => {
  const field = {
    id: attribute,
    controlType,
    model: `.attributes.${attribute}`,
    placeholder: appMessages.placeholders[placeholder || attribute] && formatMessage(appMessages.placeholders[placeholder || attribute]),
    label: appMessages.attributes[label || attribute] && formatMessage(appMessages.attributes[label || attribute]),
    validators: {},
    errorMessages: {},
    hint,
  };
  if (required) {
    field.validators.required = typeof required === 'function' ? required : validateRequired;
    field.errorMessages.required = formatMessage(appMessages.forms.fieldRequired);
  }
  return field;
};

const getCategoryFields = (args, formatMessage, appMessages) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, appMessages),
        getTitleFormField(formatMessage, appMessages),
        getShortTitleFormField(formatMessage, appMessages),
      ],
    }],
  },
  body: {
    main: [{
      fields: [getMarkdownField(formatMessage, appMessages)],
    }],
    aside: [{
      fields: [getFormField(formatMessage, appMessages, 'url', 'url')],
    }],
  },
});

const getMeasureFields = (args, formatMessage, appMessages) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getTitleFormField(formatMessage, appMessages),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage, appMessages),
      ],
    }],
  },
  body: {
    main: [{
      fields: [
        getMarkdownField(formatMessage, appMessages),
        getMarkdownField(formatMessage, appMessages, 'outcome'),
        getMarkdownField(formatMessage, appMessages, 'indicator_summary'),
      ],
    }],
    aside: [{
      fields: [
        getDateField(formatMessage, appMessages, 'target_date'),
        getFormField(formatMessage, appMessages, 'textarea', 'target_date_comment'),
      ],
    }],
  },
});

const getIndicatorFields = (args, formatMessage, appMessages) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, appMessages, false, true),
        getTitleFormField(formatMessage, appMessages, 'titleText'),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage, appMessages),
      ],
    }],
  },
  body: {
    main: [{
      fields: [getMarkdownField(formatMessage, appMessages)],
    }],
  },
});

const getRecommendationFields = (args, formatMessage, appMessages) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, appMessages, true), // required
        getTitleFormField(formatMessage, appMessages),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage, appMessages),
      ],
    }],
  },
  body: {
    main: [{
      fields: [
        getAcceptedField(formatMessage, appMessages),
        getMarkdownField(formatMessage, appMessages, 'response'),
      ],
    }],
  },
});

const getSdgtargetFields = (args, formatMessage, appMessages) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, appMessages, true), // required
        getTitleFormField(formatMessage, appMessages, 'titleText'),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage, appMessages),
      ],
    }],
  },
  body: {
    main: [{
      fields: [getMarkdownField(formatMessage, appMessages)],
    }],
  },
});

export const getEntityFields = (path, args, formatMessage, appMessages) => {
  switch (path) {
    case 'categories':
      return getCategoryFields(args, formatMessage, appMessages);
    case 'measures':
      return getMeasureFields(args, formatMessage, appMessages);
    case 'indicators':
      return getIndicatorFields(args, formatMessage, appMessages);
    case 'recommendations':
      return getRecommendationFields(args, formatMessage, appMessages);
    case 'sdgtargets':
      return getSdgtargetFields(args, formatMessage, appMessages);
    default:
      return {};
  }
};
