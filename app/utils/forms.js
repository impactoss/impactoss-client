import { Map, List } from 'immutable';
import { sortEntities } from 'utils/sort';

import { filter } from 'lodash/collection';

import {
  getEntityTitle,
  getEntityReference,
  getCategoryShortTitle,
} from 'utils/entities';

import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';
import validateAllowed from 'components/forms/validators/validate-allowed';
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
  IS_ARCHIVE_STATUSES,
  SUPPORT_LEVELS,
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
  ? entities.toList().map(
    (entity) => entityOption(entity, defaultToId, hasTags)
  )
  : List();

export const userOption = (entity, activeUserId, searchAttributes) => Map({
  value: entity.get('id'),
  label: entity.getIn(['attributes', 'name']),
  domain: entity.getIn(['attributes', 'domain']),
  checked: activeUserId ? entity.get('id') === activeUserId.toString() : false,
  searchAttributes: searchAttributes
    ? List([...searchAttributes, 'label'])
    : null,
});

export const userOptions = (entities, activeUserId, searchAttributes) => entities
  ? entities.reduce(
    (options, entity) => options.push(
      userOption(entity, activeUserId, searchAttributes)
    ), List()
  )
  : List();

export const parentCategoryOption = (entity, activeParentId) => Map({
  value: entity.get('id'),
  label: entity.getIn(['attributes', 'title']),
  checked: activeParentId ? entity.get('id') === activeParentId.toString() : false,
});

export const parentCategoryOptions = (entities, activeParentId) => entities
  ? entities.reduce((options, entity) => options.push(parentCategoryOption(entity, activeParentId)), List())
  : List();

export const dateOption = (entity, activeDateId) => Map({
  value: entity.get('id'),
  label: entity.getIn(['attributes', 'due_date']),
  checked: activeDateId ? entity.get('id') === activeDateId.toString() : false,
});

export const taxonomyOptions = (taxonomies) => taxonomies
  ? sortEntities(taxonomies, 'asc', 'priority').reduce(
    (values, tax) => values.set(
      tax.get('id'),
      entityOptions(tax.get('categories'), false, false)
    ),
    Map(),
  )
  : Map();

const getTaxTitle = (id, contextIntl) => contextIntl ? contextIntl.formatMessage(appMessages.entities.taxonomies[id].single) : '';

// turn taxonomies into multiselect options
export const makeTagFilterGroups = (taxonomies, contextIntl) => taxonomies && sortEntities(taxonomies, 'asc', 'priority').map((taxonomy) => ({
  title: getTaxTitle(parseInt(taxonomy.get('id'), 10), contextIntl),
  palette: ['taxonomies', parseInt(taxonomy.get('id'), 10)],
  options: taxonomy.get('categories').map((category) => ({
    reference: getEntityReference(category, false),
    label: getEntityTitle(category),
    filterLabel: getCategoryShortTitle(category),
    showCount: false,
    value: category.get('id'),
  })).valueSeq().toArray(),
})).toArray();

export const renderMeasureControl = (entities, taxonomies, onCreateOption, contextIntl) => entities
  ? {
    id: 'actions',
    name: 'associatedMeasures',
    dataPath: ['associatedMeasures'],
    label: contextIntl.formatMessage(appMessages.entities.measures.plural),
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

export const renderRecommendationControl = (
  fwId,
  entities,
  taxonomies,
  onCreateOption,
  contextIntl,
) =>
  entities
    ? {
      id: `recommendations.${fwId}`,
      nam: `associatedRecommendationsByFw.${fwId}`,
      dataPath: ['associatedRecommendationsByFw', fwId],
      label: contextIntl.formatMessage(appMessages.entities[`recommendations_${fwId}`].plural),
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

// recommendations grouped by framework
export const renderRecommendationsByFwControl = (
  entitiesByFw,
  taxonomies,
  onCreateOption,
  contextIntl,
) =>
  entitiesByFw
    ? entitiesByFw.reduce(
      (controls, entities, fwid) => controls.concat({
        id: `recommendations.${fwid}`,
        name: `associatedRecommendationsByFw.${fwid}`,
        dataPath: ['associatedRecommendationsByFw', fwid],
        label: contextIntl.formatMessage(appMessages.entities[`recommendations_${fwid}`].plural),
        controlType: 'multiselect',
        options: entityOptions(entities),
        advanced: true,
        selectAll: true,
        tagFilterGroups: makeTagFilterGroups(taxonomies, contextIntl),
        onCreate: onCreateOption
          ? () => onCreateOption({
            path: 'recommendations',
            attributes: { framework_id: fwid },
          })
          : null,
      }),
      [],
    )
    : null;

// taxonomies with categories "embedded"
export const renderTaxonomyControl = ({
  taxonomies,
  onCreateOption,
  contextIntl,
}) =>
  taxonomies
    ? sortEntities(taxonomies, 'asc', 'priority').reduce(
      (controls, taxonomy) => controls.concat({
        id: taxonomy.get('id'),
        name: `associatedTaxonomies.${taxonomy.get('id')}`,
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
      }),
      [],
    )
    : [];

export const renderIndicatorControl = (entities, onCreateOption, contextIntl) =>
  entities
    ? {
      id: 'indicators',
      name: 'associatedIndicators',
      dataPath: ['associatedIndicators'],
      label: contextIntl.formatMessage(appMessages.entities.indicators.plural),
      controlType: 'multiselect',
      options: entityOptions(entities, true),
      advanced: true,
      selectAll: true,
      onCreate: onCreateOption
        ? () => onCreateOption({ path: 'indicators' })
        : null,
    }
    : null;

export const renderUserControl = (
  entities,
  label,
  activeUserId,
) =>
  entities
    ? {
      id: 'users',
      name: 'associatedUser',
      dataPath: ['associatedUser'],
      label,
      controlType: 'multiselect',
      multiple: false,
      options: userOptions(entities, activeUserId, ['name', 'domain']),
      placeholderMessageId: 'searchPlaceholderUsers',
    }
    : null;

export const renderParentCategoryControl = (entities, label, activeParentId) =>
  entities
    ? {
      id: 'associatedCategory',
      name: 'associatedCategory',
      dataPath: ['associatedCategory'],
      label,
      controlType: 'multiselect',
      multiple: false,
      options: parentCategoryOptions(entities, activeParentId),
    }
    : null;

const getAssociatedEntities = (entities) =>
  entities
    ? entities.reduce(
      (entitiesAssociated, entity) => {
        if (entity && entity.get('associated')) {
          return entitiesAssociated.set(entity.get('id'), entity.get('associated'));
        }
        return entitiesAssociated;
      },
      Map(),
    )
    : Map();

const getAssociatedCategories = (taxonomy) =>
  taxonomy.get('categories')
    ? getAssociatedEntities(taxonomy.get('categories'))
    : Map();

export const getCategoryUpdatesFromFormData = ({
  formData,
  taxonomies,
  createKey,
}) => taxonomies.reduce((updates, tax, taxId) => {
  const formCategoryIds = getCheckedValuesFromOptions(formData.getIn(['associatedTaxonomies', taxId]));

  // store associated cats as { [cat.id]: [association.id], ... }
  // then we can use keys for creating new associations and values for deleting
  const associatedCategories = getAssociatedCategories(tax);
  return Map({
    delete: updates.get('delete').concat(
      associatedCategories.reduce(
        (associatedIds, associatedId, catId) => !formCategoryIds.includes(catId)
          ? associatedIds.push(associatedId)
          : associatedIds,
        List(),
      )
    ),
    create: updates.get('create').concat(formCategoryIds.reduce((payloads, catId) => !associatedCategories.has(catId)
      ? payloads.push(Map({
        category_id: catId,
        [createKey]: formData.get('id'),
      }))
      : payloads, List())),
  });
}, Map({ delete: List(), create: List() }));

export const getConnectionUpdatesFromFormData = ({
  formData,
  connections,
  connectionAttribute,
  createConnectionKey,
  createKey,
  allowMultiple = true,
  taxonomyCategoryIds,
}) => {
  let formConnectionIds = List();
  if (formData) {
    if (Array.isArray(connectionAttribute)) {
      formConnectionIds = getCheckedValuesFromOptions(formData.getIn(connectionAttribute));
    } else {
      formConnectionIds = getCheckedValuesFromOptions(formData.get(connectionAttribute));
    }
  }
  // store associated Actions as { [action.id]: [association.id], ... }
  const associatedConnections = getAssociatedEntities(connections);
  const createList = formConnectionIds.reduce(
    (payloads, id) => !associatedConnections.has(id)
      ? payloads.push(Map({
        [createConnectionKey]: id,
        [createKey]: formData.get('id'),
      }))
      : payloads,
    List(),
  );
  let deleteList = associatedConnections.reduce(
    (associatedIds, associatedId, id) => !formConnectionIds.includes(id)
      ? associatedIds.push(associatedId)
      : associatedIds,
    List()
  );
  // also remove any other category associations an entity may have
  // if it cannot have multiple categories ()
  // only makes sense if there are any connections to create
  if (!allowMultiple && taxonomyCategoryIds && createList.size > 0) {
    // for each payload in the create list...
    const deleteList1 = createList.reduce(
      (memo, payload) => {
        // get the entity and existing category connections ...
        const connectionId = payload.get(createConnectionKey);
        const connection = connections.get(connectionId);
        const connectionCategories = connection.get('categories');
        // and figure out those that are of the same taxonomy
        const associationsToRemove = connectionCategories.keySeq().filter(
          (associationId) => {
            const otherId = connectionCategories.get(associationId);
            return taxonomyCategoryIds.includes(`${otherId}`);
          }
        );
        return associationsToRemove
          ? memo.concat(associationsToRemove)
          : memo;
      },
      List(),
    );
    if (deleteList1) {
      deleteList = deleteList.concat(deleteList1);
    }
  }
  return Map({
    delete: deleteList,
    create: createList,
  });
};


// only show the highest rated role (lower role ids means higher)
export const getHighestUserRoleId = (roles) =>
  roles.reduce((currentHighestRoleId, role) =>
    role.get('associated') && parseInt(role.get('id'), 10) < parseInt(currentHighestRoleId, 10)
      ? role.get('id').toString() : currentHighestRoleId.toString(), USER_ROLES.DEFAULT.value);

export const getRoleFormField = (formatMessage, roleOptions) => ({
  id: 'role',
  controlType: 'select',
  name: 'associatedRole',
  label: formatMessage(appMessages.entities.roles.single),
  options: Object.values(filter(USER_ROLES, (userRole) => roleOptions.map((roleOption) => parseInt(roleOption.get('id'), 10)).includes(userRole.value)
    || userRole.value === USER_ROLES.DEFAULT.value)),
});

export const getSupportField = (formatMessage) => ({
  id: 'support_level',
  controlType: 'select',
  name: 'attributes.support_level',
  label: formatMessage(appMessages.attributes.support_level),
  options: SUPPORT_LEVELS,
});

export const getFrequencyField = (formatMessage, isFieldDisabled) => ({
  id: 'frequency_months',
  controlType: 'select',
  name: 'attributes.frequency_months',
  label: formatMessage(appMessages.attributes.frequency_months),
  options: REPORT_FREQUENCIES,
  isFieldDisabled,
});

export const getDocumentStatusField = (formatMessage) => ({
  id: 'document_public',
  controlType: 'select',
  name: 'attributes.document_public',
  label: formatMessage(appMessages.attributes.document_public),
  options: DOC_PUBLISH_STATUSES,
});

export const getStatusField = (formatMessage) => ({
  id: 'status',
  controlType: 'select',
  name: 'attributes.draft',
  label: formatMessage(appMessages.attributes.draft),
  options: PUBLISH_STATUSES,
});

export const getArchiveField = (formatMessage) => ({
  id: 'is_archive',
  controlType: 'select',
  name: 'attributes.is_archive',
  label: formatMessage(appMessages.attributes.is_archive),
  options: IS_ARCHIVE_STATUSES,
});

export const getFrameworkFormField = (formatMessage, fwOptions) => ({
  id: 'framework',
  controlType: 'select',
  name: 'attributes.framework_id',
  label: formatMessage(appMessages.attributes.framework_id),
  options: Object.values(fwOptions.toJS()).map((fw) => ({
    value: fw.id,
    message: `frameworks.${fw.id}`,
  })),
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

export const getDueDateDateOptions = (dates, formatMessage, formatDate, activeDateId = 'null') => {
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
        const label = formatDate
          && `${formatDate(new Date(date.getIn(['attributes', 'due_date'])))}${getDueDateStatus(date, formatMessage)}`;
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

export const getDueDateOptionsField = (formatMessage, dateOptions) => ({
  id: 'due_date_id',
  controlType: 'radio',
  name: 'attributes.due_date_id',
  options: dateOptions,
  hints: {
    1: formatMessage(appMessages.entities.due_dates.empty),
  },
});

export const getTitleFormField = (formatMessage, controlType = 'title', attribute = 'title') => getFormField({
  formatMessage,
  controlType,
  attribute,
  required: true,
});

export const getReferenceFormField = ({
  formatMessage,
  required = false,
  isAutoReference = false,
  prohibitedValues,
}) => getFormField({
  formatMessage,
  controlType: 'short',
  attribute: 'reference',
  required,
  label: required ? 'reference' : 'referenceOptional',
  hint: isAutoReference ? formatMessage(appMessages.hints.autoReference) : null,
  prohibitedValues,
});

export const getShortTitleFormField = (formatMessage) => getFormField({
  formatMessage,
  controlType: 'short',
  attribute: 'short_title',
});

export const getMenuTitleFormField = (formatMessage) => getFormField({
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

export const getMarkdownFormField = ({
  formatMessage,
  attribute = 'description',
  label,
  required,
  placeholder,
  hint,
}) => getFormField({
  formatMessage,
  controlType: 'markdown',
  attribute,
  label: label || attribute,
  placeholder: placeholder || attribute,
  required,
  hint: hint
    ? (appMessages.hints[hint] && formatMessage(appMessages.hints[hint]))
    : (appMessages.hints[attribute] && formatMessage(appMessages.hints[attribute])),
});

// unused
export const getTextareaField = (formatMessage, attribute = 'description') => getFormField({
  formatMessage,
  controlType: 'textarea',
  attribute,
});

export const getDateField = ({
  formatMessage,
  attribute,
  required = false,
  label,
  dynamicValidators,
  isFieldDisabled,
  modifyFieldAttributes,
}) => {
  const field = getFormField({
    formatMessage,
    controlType: 'date',
    attribute,
    required,
    label,
    dynamicValidators,
  });
  if (isFieldDisabled && typeof isFieldDisabled === 'function') {
    field.isFieldDisabled = isFieldDisabled;
  }
  if (modifyFieldAttributes && typeof modifyFieldAttributes === 'function') {
    field.modifyFieldAttributes = modifyFieldAttributes;
  }
  field.validators.date = validateDateFormat;
  field.errorMessages.date = formatMessage(appMessages.forms.dateFormatError, { format: DATE_FORMAT });
  return field;
};

export const modifyStartDateField = (field, isRepeat, intl) => {
  const modifiedField = { ...field };
  if (isRepeat) {
    modifiedField.required = true;
    modifiedField.validators = { ...modifiedField.validators, required: validateRequired };
    modifiedField.errorMessages = { ...modifiedField.errorMessages, required: intl.formatMessage(appMessages.forms.fieldRequired) };
    modifiedField.label = intl.formatMessage(appMessages.attributes.start_date_only);
  } else {
    if (modifiedField.validators
      && modifiedField.validators
      && modifiedField.validators.required
    ) {
      delete modifiedField.validators.required;
    }
    if (modifiedField.errorMessages
      && modifiedField.errorMessages
      && modifiedField.errorMessages.required) {
      delete modifiedField.errorMessages.required;
    }
    modifiedField.required = false;
    modifiedField.label = intl.formatMessage(appMessages.attributes.start_date);
  }
  return modifiedField;
};

export const getCheckboxField = (formatMessage, attribute, dynamicValidators) => (
  {
    id: attribute,
    controlType: 'checkbox',
    name: `attributes.${attribute}`,
    label: appMessages.attributes[attribute] && formatMessage(appMessages.attributes[attribute]),
    // value: entity && entity.getIn(['attributes', attribute]) ? entity.getIn(['attributes', attribute]) : false,
    dynamicValidators,
    hint: appMessages.hints[attribute] && formatMessage(appMessages.hints[attribute]),
  });

export const getUploadField = (formatMessage) => getFormField({
  formatMessage,
  controlType: 'uploader',
  attribute: 'document_url',
  placeholder: 'url',
});

export const getEmailFormField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'email',
    attribute: 'email',
    type: 'email',
    required: true,
  });
  field.validators.email = validateEmailFormat;
  field.errorMessages.email = formatMessage(appMessages.forms.emailFormatError);
  return field;
};

export const getNameField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'name',
    required: true,
  });
  return field;
};

export const getPasswordField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'password',
    type: 'password',
    required: true,
  });
  field.validators.passwordLength = (val) => validateLength(val, 6);
  field.errorMessages.passwordLength = formatMessage(appMessages.forms.passwordShortError);
  return field;
};

export const getPasswordCurrentField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'password',
    placeholder: 'passwordCurrent',
    type: 'password',
    required: true,
  });
  return field;
};

export const getPasswordNewField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'passwordNew',
    type: 'password',
    required: true,
  });
  return field;
};

export const getPasswordConfirmationField = (formatMessage) => {
  const field = getFormField({
    formatMessage,
    controlType: 'input',
    attribute: 'passwordConfirmation',
    type: 'password',
    required: true,
  });
  return field;
};

export const getFormField = ({
  formatMessage,
  controlType,
  attribute,
  name,
  required,
  label,
  placeholder,
  hint,
  dynamicValidators,
  type,
  prohibitedValues,
}) => {
  const field = {
    id: attribute,
    name: name || `attributes.${attribute}`,
    controlType,
    type,
    placeholder: appMessages.placeholders[placeholder || attribute] && formatMessage(appMessages.placeholders[placeholder || attribute]),
    label: appMessages.attributes[label || attribute] && formatMessage(appMessages.attributes[label || attribute]),
    validators: {},
    errorMessages: {},
    hint,
  };
  if (dynamicValidators) {
    field.dynamicValidators = dynamicValidators;
  }
  if (required) {
    field.validators.required = typeof required === 'function' ? required : validateRequired;
    field.errorMessages.required = formatMessage(appMessages.forms.fieldRequired);
  }
  if (prohibitedValues && Array.isArray(prohibitedValues)) {
    field.validators.prohibited = (val) => validateAllowed(val, prohibitedValues);
    field.errorMessages.prohibited = formatMessage(appMessages.forms.valueProhibited);
  }
  return field;
};

const getCategoryFields = (args, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField({ formatMessage }),
        getTitleFormField(formatMessage),
        getShortTitleFormField(formatMessage),
      ],
    }],
    aside: args.taxonomy && args.taxonomy.getIn(['attributes', 'tags_users'])
      ? [{
        fields: [
          getCheckboxField(formatMessage, 'user_only'),
          getStatusField(formatMessage),
        ],
      }]
      : [{
        fields: [getStatusField(formatMessage)],
      }],
  },
  body: {
    main: [{
      fields: [getMarkdownFormField({ formatMessage })],
    }],
    aside: [{
      fields: [
        (args.categoryParentOptions && args.parentTaxonomy)
          ? renderParentCategoryControl(
            args.categoryParentOptions,
            getEntityTitle(args.parentTaxonomy),
          )
          : null,
        getFormField({
          formatMessage,
          controlType: 'url',
          attribute: 'url',
        }),
      ],
    }],
  },
});

const getIndicatorFields = ({ existingReferences }, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField({
          formatMessage,
          required: true,
          prohibitedValues: existingReferences,
        }),
        getTitleFormField(formatMessage, 'titleText'),
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
      fields: [getMarkdownFormField({ formatMessage })],
    }],
  },
});

const getRecommendationFields = ({ frameworks, hasResponse, existingReferences }, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        frameworks && getFrameworkFormField(formatMessage, frameworks),
        getReferenceFormField({
          formatMessage,
          required: true,
          prohibitedValues: existingReferences,
        }),
        getTitleFormField(formatMessage),
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
        getMarkdownFormField({
          formatMessage,
          attribute: 'description',
          label: 'fullRecommendation',
          placeholder: 'fullRecommendation',
          hint: 'fullRecommendation',
        }),
        hasResponse && getSupportField(formatMessage),
        hasResponse && getMarkdownFormField({
          formatMessage,
          attribute: 'response',
        }),
      ],
    }],
  },
});

const getMeasureFields = ({ existingReferences }, formatMessage) => ({
  header: {
    main: [{ // fieldGroup
      fields: [
        getReferenceFormField({
          formatMessage,
          required: true,
          prohibitedValues: existingReferences,
        }),
        getTitleFormField(formatMessage),
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
        getMarkdownFormField({ formatMessage }),
      ],
    }],
    aside: [{ // fieldGroup
      fields: [
        getDateField({ formatMessage, attribute: 'target_date' }),
        getTextareaField(formatMessage, 'target_date_comment'),
      ],
    }],
  },
});

export const getEntityAttributeFields = (path, args, contextIntl) => {
  switch (path) {
    case 'categories':
      return getCategoryFields(args.categories, contextIntl.formatMessage);
    case 'measures':
      return getMeasureFields(args.measures, contextIntl.formatMessage);
    case 'indicators':
      return getIndicatorFields(args.indicators, contextIntl.formatMessage);
    case 'recommendations':
      return getRecommendationFields(args.recommendations, contextIntl.formatMessage);
    default:
      return {};
  }
};

export const validateField = (value, field) => {
  // find the first validator that fails and return the corresponding error msg
  const { validators, errorMessages } = field;
  const firstErrorKey = validators
    && Object.keys(validators).length > 0
    && Object.keys(validators)
      .find((validator) =>
        validators[validator]
        && !validators[validator](value));

  return firstErrorKey ? errorMessages[firstErrorKey] : null;
};
