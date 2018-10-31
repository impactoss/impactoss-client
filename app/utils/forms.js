import { Map, List } from 'immutable';
import { sortEntities } from 'utils/sort';

import { filter, reduce } from 'lodash/collection';

import {
  getEntityTitle,
  getEntityReference,
  getCategoryShortTitle,
} from 'utils/entities';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';
import validateDateFormat from 'components/forms/validators/validate-date-format';
import validateRequired from 'components/forms/validators/validate-required';
import validateNumber from 'components/forms/validators/validate-number';
import validateEmailFormat from 'components/forms/validators/validate-email-format';
import validateLength from 'components/forms/validators/validate-length';

import {
  REPORT_FREQUENCIES,
  PUBLISH_STATUSES,
  USER_ROLES,
  DATE_FORMAT,
  DOC_PUBLISH_STATUSES,
  ACCEPTED_STATUSES,
  MEASURE_SHAPE,
} from 'themes/config';

import appMessages from 'containers/App/messages';

export const entityOption = (entity, defaultToId, hasTags) => Map({
  value: entity.get('id'),
  label: getEntityTitle(entity),
  reference: getEntityReference(entity, defaultToId),
  checked: !!entity.get('associated'),
  tags: hasTags && entity.get('categories'),
  draft: entity.getIn(['attributes', 'draft']),
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
  ? sortEntities(taxonomies, 'asc', 'priority').reduce((values, tax) =>
    values.set(tax.get('id'), entityOptions(tax.get('categories'), false, false)), Map())
  : Map();

const getTaxTitle = (id, contextIntl) => contextIntl ? contextIntl.formatMessage(appMessages.entities.taxonomies[id].single) : '';

// turn taxonomies into multiselect options
export const makeTagFilterGroups = (taxonomies, contextIntl) =>
  taxonomies && sortEntities(taxonomies, 'asc', 'priority').map((taxonomy) => ({
    title: getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl),
    palette: ['taxonomies', parseInt(taxonomy.get('id'), 10)],
    options: taxonomy.get('categories').map((category) => ({
      reference: getEntityReference(category, false),
      label: getEntityTitle(category),
      filterLabel: getCategoryShortTitle(category),
      showCount: false,
      value: category.get('id'),
    })).toList().toArray(),
  })).toList().toArray();

export const renderMeasureControl = (entities, taxonomies, onCreateOption, contextIntl) => entities
? {
  id: 'actions',
  model: '.associatedMeasures',
  dataPath: ['associatedMeasures'],
  label: 'Actions',
  controlType: 'multiselect',
  options: entityOptions(entities, true),
  advanced: true,
  selectAll: true,
  tagFilterGroups: makeTagFilterGroups(taxonomies, contextIntl),
  onCreate: onCreateOption
    ? () => onCreateOption({ path: 'measures' })
    : null,
}
: null;

export const renderSdgTargetControl = (entities, taxonomies, onCreateOption, contextIntl) => entities
? {
  id: 'sdgtargets',
  model: '.associatedSdgTargets',
  dataPath: ['associatedSdgTargets'],
  label: 'SDG targets',
  controlType: 'multiselect',
  options: entityOptions(entities, true),
  advanced: true,
  selectAll: true,
  tagFilterGroups: makeTagFilterGroups(taxonomies, contextIntl),
  onCreate: onCreateOption
    ? () => onCreateOption({ path: 'sdgtargets' })
    : null,
}
: null;


export const renderRecommendationControl = (entities, taxonomies, onCreateOption, contextIntl) => entities
? {
  id: 'recommendations',
  model: '.associatedRecommendations',
  dataPath: ['associatedRecommendations'],
  label: 'Recommendations',
  controlType: 'multiselect',
  options: entityOptions(entities),
  advanced: true,
  selectAll: true,
  tagFilterGroups: makeTagFilterGroups(taxonomies, contextIntl),
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

export const renderTaxonomyControl = (taxonomies, onCreateOption, contextIntl) => taxonomies
? sortEntities(taxonomies, 'asc', 'priority').reduce((controls, taxonomy) => controls.concat({
  id: taxonomy.get('id'),
  model: `.associatedTaxonomies.${taxonomy.get('id')}`,
  dataPath: ['associatedTaxonomies', taxonomy.get('id')],
  label: getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl),
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
  entities
  ? entities.reduce((entitiesAssociated, entity) => entity.get('associated')
    ? entitiesAssociated.set(entity.get('id'), entity.getIn(['associated', 'id']))
    : entitiesAssociated
  , Map())
  : Map();

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
  const formConnectionIds = formData
    ? getCheckedValuesFromOptions(formData.get(connectionAttribute))
    : List();

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
    role.get('associated') && parseInt(role.get('id'), 10) < parseInt(currentHighestRoleId, 10)
      ? role.get('id').toString()
      : currentHighestRoleId.toString()
  , USER_ROLES.DEFAULT.value);

export const getRoleFormField = (formatMessage, obsoleteAppMessages, roleOptions) => ({
  id: 'role',
  controlType: 'select',
  model: '.associatedRole',
  label: formatMessage(appMessages.entities.roles.single),
  value: getHighestUserRoleId(roleOptions).toString(),
  options: Object.values(filter(USER_ROLES, (userRole) =>
    roleOptions.map((roleOption) => parseInt(roleOption.get('id'), 10)).includes(userRole.value)
    || userRole.value === USER_ROLES.DEFAULT.value
  )),
});

export const getAcceptedField = (formatMessage, obsoleteAppMessages, entity) => ({
  id: 'accepted',
  controlType: 'select',
  model: '.attributes.accepted',
  label: formatMessage(appMessages.attributes.accepted),
  value: entity ? entity.getIn(['attributes', 'accepted']) : true,
  options: ACCEPTED_STATUSES,
});

export const getFrequencyField = (formatMessage, obsoleteAppMessages, entity) => ({
  id: 'frequency_months',
  controlType: 'select',
  model: '.attributes.frequency_months',
  label: formatMessage(appMessages.attributes.frequency_months),
  value: entity ? parseInt(entity.getIn(['attributes', 'frequency_months']), 10) : 1,
  options: REPORT_FREQUENCIES,
});

export const getDocumentStatusField = (formatMessage, obsoleteAppMessages, entity) => ({
  id: 'document_public',
  controlType: 'select',
  model: '.attributes.document_public',
  label: formatMessage(appMessages.attributes.document_public),
  value: entity ? entity.getIn(['attributes', 'document_public']) : false,
  options: DOC_PUBLISH_STATUSES,
});

export const getStatusField = (formatMessage, obsoleteAppMessages, entity) => ({
  id: 'status',
  controlType: 'select',
  model: '.attributes.draft',
  label: formatMessage(appMessages.attributes.draft),
  value: entity ? entity.getIn(['attributes', 'draft']) : true,
  options: PUBLISH_STATUSES,
});

const getDueDateStatus = (date, formatMessage) => {
  if (date.getIn(['attributes', 'overdue'])) {
    return ` ${formatMessage(appMessages.entities.due_dates.overdue)}`;
  }
  if (date.getIn(['attributes', 'due'])) {
    return ` ${formatMessage(appMessages.entities.due_dates.due)}`;
  }
  return '';
};

export const getDueDateDateOptions = (dates, formatMessage, obsoleteAppMessages, formatDate, activeDateId = 'null') => {
  const NO_OF_REPORT_OPTIONS = 1;
  let excludeCount = 0;
  const dateOptions = dates
    ? dates.reduce((memo, date, i) => {
      const dateActive = date.get('id') === activeDateId.toString();
      const optionNoNotExceeded = i - excludeCount < NO_OF_REPORT_OPTIONS;
      const withoutReport = !date.getIn(['attributes', 'has_progress_report']);
      // only allow upcoming and those that are not associated
      if ((optionNoNotExceeded && withoutReport) || dateActive) {
        if (date.getIn(['attributes', 'overdue']) || dateActive) {
          excludeCount += 1;
        }
        // exclude overdue and already assigned date from max no of date options
        const label = formatDate &&
          `${formatDate(new Date(date.getIn(['attributes', 'due_date'])))}${getDueDateStatus(date, formatMessage)}`;
        return memo.concat([
          {
            value: date.get('id'),
            label,
            highlight: date.getIn(['attributes', 'overdue']),
          },
        ]);
      }
      excludeCount += 1;
      return memo;
    }, [])
  : [];
  return dateOptions.concat({
    value: '0',
    label: formatMessage && formatMessage(appMessages.entities.progress_reports.unscheduled_short),
  });
};

export const getDueDateOptionsField = (formatMessage, obsoleteAppMessages, dateOptions) => ({
  id: 'due_date_id',
  controlType: 'radio',
  model: '.attributes.due_date_id',
  options: dateOptions,
  hints: {
    1: formatMessage(appMessages.entities.due_dates.empty),
  },
});

export const getTitleFormField = (formatMessage, obsoleteAppMessages, controlType = 'title', attribute = 'title') =>
  getFormField({
    formatMessage,
    controlType,
    attribute,
    required: true,
  });

export const getReferenceFormField = (formatMessage, obsoleteAppMessages, required = false, isAutoReference = false) =>
  getFormField({
    formatMessage,
    controlType: 'short',
    attribute: 'reference',
    required,
    label: required ? 'reference' : 'referenceOptional',
    hint: isAutoReference ? formatMessage(appMessages.hints.autoReference) : null,
  });

export const getShortTitleFormField = (formatMessage) =>
  getFormField({
    formatMessage,
    controlType: 'short',
    attribute: 'short_title',
  });

export const getMenuTitleFormField = (formatMessage) =>
  getFormField({
    formatMessage,
    controlType: 'short',
    attribute: 'menu_title',
    required: true,
  });

export const getMenuOrderFormField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'short',
    attribute: 'order',
  });
  field.validators.number = validateNumber;
  field.errorMessages.number = formatMessage(appMessages.forms.numberError);
  return field;
};

export const getMarkdownField = (formatMessage, obsoleteAppMessages, attribute = 'description', label, placeholder, hint) =>
  getFormField({
    formatMessage,
    controlType: 'markdown',
    attribute,
    label: label || attribute,
    placeholder: placeholder || attribute,
    hint: hint
      ? (appMessages.hints[hint] && formatMessage(appMessages.hints[hint]))
      : (appMessages.hints[attribute] && formatMessage(appMessages.hints[attribute])),
  });

export const getTextareaField = (formatMessage, obsoleteAppMessages, attribute = 'description') =>
  getFormField({
    formatMessage,
    controlType: 'textarea',
    attribute,
  });

export const getDateField = (formatMessage, obsoleteAppMessages, attribute, required = false, label, onChange) => {
  const field = getFormField({
    formatMessage,
    controlType: 'date',
    attribute,
    required,
    label,
    onChange,
  });
  field.validators.date = validateDateFormat;
  field.errorMessages.date = formatMessage(appMessages.forms.dateFormatError, { format: DATE_FORMAT });
  return field;
};

export const getCheckboxField = (formatMessage, obsoleteAppMessages, attribute, entity, onChange) => (
  {
    id: attribute,
    controlType: 'checkbox',
    model: `.attributes.${attribute}`,
    label: appMessages.attributes[attribute] && formatMessage(appMessages.attributes[attribute]),
    value: entity && entity.getIn(['attributes', attribute]) ? entity.getIn(['attributes', attribute]) : false,
    changeAction: onChange,
    hint: appMessages.hints[attribute] && formatMessage(appMessages.hints[attribute]),
  });

export const getUploadField = (formatMessage) =>
  getFormField({
    formatMessage,
    controlType: 'uploader',
    attribute: 'document_url',
    placeholder: 'url',
  });

export const getEmailField = (formatMessage, obsoleteAppMessages, model = '.attributes.email') => {
  const field = getFormField({
    formatMessage,
    controlType: 'email',
    attribute: 'email',
    type: 'email',
    required: true,
    model,
  });
  field.validators.email = validateEmailFormat;
  field.errorMessages.email = formatMessage(appMessages.forms.emailFormatError);
  return field;
};

export const getNameField = (formatMessage, obsoleteAppMessages, model = '.attributes.name') => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'name',
    required: true,
    model,
  });
  return field;
};

export const getPasswordField = (formatMessage, obsoleteAppMessages, model = '.attributes.password') => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'password',
    type: 'password',
    required: true,
    model,
  });
  field.validators.passwordLength = (val) => validateLength(val, 6);
  field.errorMessages.passwordLength = formatMessage(appMessages.forms.passwordShortError);
  return field;
};

export const getPasswordCurrentField = (formatMessage, obsoleteAppMessages, model = '.attributes.password') => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'password',
    placeholder: 'passwordCurrent',
    type: 'password',
    required: true,
    model,
  });
  // field.validators.email = validateEmailFormat;
  // field.errorMessages.email = formatMessage(appMessages.forms.emailFormatError);
  return field;
};

export const getPasswordNewField = (formatMessage, obsoleteAppMessages, model = '.attributes.passwordNew') => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'passwordNew',
    type: 'password',
    required: true,
    model,
  });
  // field.validators.email = validateEmailFormat;
  // field.errorMessages.email = formatMessage(appMessages.forms.emailFormatError);
  return field;
};

export const getPasswordConfirmationField = (formatMessage, obsoleteAppMessages, model = '.attributes.passwordConfirmation') => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'passwordConfirmation',
    type: 'password',
    required: true,
    model,
  });
  // field.validators.email = validateEmailFormat;
  // field.errorMessages.email = formatMessage(appMessages.forms.emailFormatError);
  return field;
};

export const getFormField = ({
  formatMessage,
  controlType,
  attribute,
  required,
  label,
  placeholder,
  hint,
  onChange,
  type,
  model,
}) => {
  const field = {
    id: attribute,
    controlType,
    type,
    model: model || `.attributes.${attribute}`,
    placeholder: appMessages.placeholders[placeholder || attribute] && formatMessage(appMessages.placeholders[placeholder || attribute]),
    label: appMessages.attributes[label || attribute] && formatMessage(appMessages.attributes[label || attribute]),
    validators: {},
    errorMessages: {},
    hint,
  };
  if (onChange) {
    field.changeAction = onChange;
  }
  if (required) {
    field.validators.required = typeof required === 'function' ? required : validateRequired;
    field.errorMessages.required = formatMessage(appMessages.forms.fieldRequired);
  }
  return field;
};

const getCategoryFields = (args, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage),
        getTitleFormField(formatMessage),
        getShortTitleFormField(formatMessage),
      ],
    }],
    aside: args.taxonomy && args.taxonomy.getIn(['attributes', 'tags_users'])
      ? [{
        fields: [
          getCheckboxField(formatMessage, null, 'user_only'),
          getStatusField(formatMessage),
        ],
      }]
      : [{
        fields: [getStatusField(formatMessage)],
      }],
  },
  body: {
    main: [{
      fields: [getMarkdownField(formatMessage)],
    }],
    aside: [{
      fields: [getFormField({
        formatMessage,
        controlType: 'url',
        attribute: 'url',
      })],
    }],
  },
});

const getIndicatorFields = (args, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, null, false, true),
        getTitleFormField(formatMessage, null, 'titleText'),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage),
      ],
    }],
  },
  body: {
    main: [{
      fields: [getMarkdownField(formatMessage)],
    }],
  },
});

const getRecommendationFields = (args, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, null, true), // required
        getTitleFormField(formatMessage, null),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage),
      ],
    }],
  },
  body: {
    main: [{
      fields: [
        getAcceptedField(formatMessage),
        getMarkdownField(formatMessage, null, 'response'),
      ],
    }],
  },
});

const getSdgtargetFields = (args, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField(formatMessage, null, true), // required
        getTitleFormField(formatMessage, null, 'titleText'),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getStatusField(formatMessage),
      ],
    }],
  },
  body: {
    main: [{
      fields: [getMarkdownField(formatMessage)],
    }],
  },
});

export const getEntityFields = (path, args, contextIntl) => {
  switch (path) {
    case 'categories':
      return getCategoryFields(args, contextIntl.formatMessage);
    case 'measures':
      return getFields({
        shape: MEASURE_SHAPE,
        contextIntl,
      });
    case 'indicators':
      return getIndicatorFields(args, contextIntl.formatMessage);
    case 'recommendations':
      return getRecommendationFields(args, contextIntl.formatMessage);
    case 'sdgtargets':
      return getSdgtargetFields(args, contextIntl.formatMessage);
    default:
      return {};
  }
};


const getSectionFields = (shape, section, column, entity, associations, onCreateOption, contextIntl) => {
  const fields = filter(shape.fields, (field) =>
    field.section === section
    && field.column === column
    && !field.disabled
  );
  const sectionGroups = [{
    fields: reduce(fields, (memo, field) => {
      if (field.control === 'title') {
        return memo.concat([getTitleFormField(contextIntl.formatMessage)]);
      }
      if (field.control === 'status') {
        return memo.concat([getStatusField(contextIntl.formatMessage, null, entity)]);
      }
      if (field.control === 'date') {
        return memo.concat([getDateField(contextIntl.formatMessage, null, field.attribute)]);
      }
      if (field.control === 'markdown') {
        return memo.concat([getMarkdownField(contextIntl.formatMessage, null, field.attribute)]);
      }
      return memo.concat([getFormField({
        controlType: field.control,
        attribute: field.attribute,
        formatMessage: contextIntl.formatMessage,
      })]);
    }, []),
  }];
  if (associations && associations.taxonomies && shape.taxonomies && shape.taxonomies.section === section && shape.taxonomies.column === column) {
    sectionGroups.push({ // fieldGroup
      label: contextIntl.formatMessage(appMessages.entities.taxonomies.plural),
      icon: 'categories',
      fields: renderTaxonomyControl(associations.taxonomies, onCreateOption, contextIntl),
    });
  }
  if (associations
    && (
      associations.measures
      || associations.recommendations
      || associations.indicators
      || associations.sgdtargets
    )
    && shape.connections
    && shape.connections.tables
    && shape.connections.section === section
    && shape.connections.column === column
  ) {
    sectionGroups.push({
      label: contextIntl.formatMessage(appMessages.entities.connections.plural),
      icon: 'connections',
      fields: reduce(shape.connections.tables, (memo, table) => {
        if (table.table === 'measures' && associations.measures) {
          return memo.concat([renderMeasureControl(associations.measures, associations.connectedTaxonomies, onCreateOption, contextIntl)]);
        }
        if (table.table === 'recommendations' && associations.recommendations) {
          return memo.concat([renderRecommendationControl(associations.recommendations, associations.connectedTaxonomies, onCreateOption, contextIntl)]);
        }
        if (table.table === 'sdgtargets' && associations.sdgtargets) {
          return memo.concat([renderSdgTargetControl(associations.sdgtargets, associations.connectedTaxonomies, onCreateOption, contextIntl)]);
        }
        if (table.table === 'indicators' && associations.indicators) {
          return memo.concat([renderIndicatorControl(associations.indicators, onCreateOption)]);
        }
        return memo;
      }, []),
    });
  }
  return sectionGroups;
};

// getHeaderAsideFields = (entity) => ([
//   {
//     fields: [
//       getMetaField(entity, appMessages),
//     ],
//   },
// ]);
// Better handle in EntityForm

export const getFields = ({
  entity,
  associations,
  onCreateOption,
  shape,
  contextIntl,
}) => ({
  header: {
    main: getSectionFields(
      shape,
      'header',
      'main',
      entity,
      associations,
      onCreateOption,
      contextIntl
    ),
    aside: getSectionFields(
      shape,
      'header',
      'aside',
      entity,
      associations,
      onCreateOption,
      contextIntl
    ),
  },
  body: {
    main: getSectionFields(
      shape,
      'body',
      'main',
      entity,
      associations,
      onCreateOption,
      contextIntl
    ),
    aside: getSectionFields(
      shape,
      'body',
      'aside',
      entity,
      associations,
      onCreateOption,
      contextIntl
    ),
  },
});
