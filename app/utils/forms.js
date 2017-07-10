import { Map, List } from 'immutable';
import { getCheckedValuesFromOptions } from 'components/forms/MultiSelectControl';

export const entityOption = (entity, reference) => Map({
  value: entity.get('id'),
  label: entity.getIn(['attributes', 'title']),
  reference,
  checked: !!entity.get('associated'),
  order: reference || entity.getIn(['attributes', 'title']),
});

export const entityOptions = (entities, includeReference) => entities
  ? entities.reduce((options, entity) => {
    if (includeReference) {
      return options.push(entityOption(
        entity,
        entity.hasIn(['attributes', 'number'])
        ? entity.getIn(['attributes', 'number'])
        : entity.get('id')
      ));
    }
    return options.push(entityOption(entity));
  }, List())
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
    values.set(tax.get('id'), entityOptions(tax.get('categories'))), Map())
  : Map();

export const renderMeasureControl = (entities) => entities
? {
  id: 'actions',
  model: '.associatedMeasures',
  dataPath: ['associatedMeasures'],
  label: 'Actions',
  controlType: 'multiselect',
  options: entityOptions(entities),
}
: null;
export const renderSdgTargetControl = (entities) => entities
? {
  id: 'sdgtargets',
  model: '.associatedSdgTargets',
  dataPath: ['associatedSdgTargets'],
  label: 'SDG targets',
  controlType: 'multiselect',
  options: entityOptions(entities),
}
: null;

export const renderRecommendationControl = (entities) => entities
? {
  id: 'recommendations',
  model: '.associatedRecommendations',
  dataPath: ['associatedRecommendations'],
  label: 'Recommendations',
  controlType: 'multiselect',
  options: entityOptions(entities, true),
}
: null;

export const renderIndicatorControl = (entities) => entities
? {
  id: 'indicators',
  model: '.associatedIndicators',
  dataPath: ['associatedIndicators'],
  label: 'Indicators',
  controlType: 'multiselect',
  options: entityOptions(entities),
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

//   // TODO use radio buttons
// export const renderDateControl = (dates, activeDateId) => dates
// ? {
//   id: 'dates',
//   model: '.associatedDate',
//   dataPath: ['associatedDate'],
//   label: 'Scheduled Date',
//   controlType: 'radio',
//   options: dateOptions(dates, activeDateId),
// }
// : null;

export const renderTaxonomyControl = (taxonomies) => taxonomies
? taxonomies.reduce((controls, tax) => controls.concat({
  id: tax.get('id'),
  model: `.associatedTaxonomies.${tax.get('id')}`,
  dataPath: ['associatedTaxonomies', tax.get('id')],
  label: tax.getIn(['attributes', 'title']),
  controlType: 'multiselect',
  multiple: tax.getIn(['attributes', 'allow_multiple']),
  options: entityOptions(tax.get('categories')),
}), [])
: [];

export const validateRequired = (val) => val !== null && val && val.length;

export const validateDateFormat = (val) => {
  if (!val) return true;
  // yyyy-mm-dd
  const dateformat = /^\d{4}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/;
  return val.match(dateformat);
};

const getAssociatedCategories = (taxonomy) => taxonomy.get('categories')
  ? taxonomy.get('categories').reduce((catsAssociated, cat) => {
    if (cat.get('associated')) {
      return catsAssociated.set(cat.get('id'), cat.get('associated').keySeq().first());
    }
    return catsAssociated;
  }, Map())
  : Map();

const getAssociatedEntities = (entities) =>
  entities.reduce((entitiesAssociated, entity) => entity.get('associated')
    ? entitiesAssociated.set(entity.get('id'), entity.get('associated').keySeq().first())
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
