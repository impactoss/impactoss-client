import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';
import { qe } from 'utils/quasi-equals';

export const makeEditGroups = (
  config,
  taxonomies,
  activeEditOption,
  hasUserRole,
  messages,
  frameworks,
  selectedFrameworkIds,
) => {
  const editGroups = {};
  const selectedFrameworks = frameworks && frameworks.filter(
    (fw) => selectedFrameworkIds.find((id) => qe(id, fw.get('id'))),
  );
  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // first prepare taxonomy options
    editGroups.taxonomies = {
      id: 'taxonomies', // filterGroupId
      label: messages.taxonomyGroup,
      show: true,
      icon: 'categories',
      options:
        // all selectedFrameworkIds must be included in tax.frameworkIds
        sortEntities(taxonomies, 'asc', 'priority')
          .filter(
            (tax) => (
              !config.taxonomies.editForFrameworks
              || selectedFrameworkIds.isSubset(tax.get('frameworkIds'))
            )
            // not a parent
            && !taxonomies.some(
              (otherTax) => qe(
                tax.get('id'),
                otherTax.getIn(['attributes', 'parent_id']),
              )
            )
          )
          .reduce(
            (memo, taxonomy) => taxonomy.get('tags')
              ? memo.concat([
                {
                  id: taxonomy.get('id'), // filterOptionId
                  label: messages.taxonomies(taxonomy.get('id')),
                  path: config.taxonomies.connectPath,
                  key: config.taxonomies.key,
                  ownKey: config.taxonomies.ownKey,
                  active: !!activeEditOption && activeEditOption.optionId === taxonomy.get('id'),
                  create: {
                    path: 'categories',
                    attributes: { taxonomy_id: taxonomy.get('id') },
                  },
                },
              ])
              : memo,
            [],
          ),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    editGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(
        config.connections.options,
        (optionsMemo, option) => {
          // exclude connections not applicabel for all frameworks
          if (
            option.frameworkFilter
            && option.editForFrameworks
            && frameworks
            && !selectedFrameworks.every((fw) => fw.getIn(['attributes', option.frameworkFilter]))
          ) {
            return optionsMemo;
          }
          if (option.groupByFramework && frameworks) {
            return frameworks
              .filter((fw) => !option.frameworkFilter || fw.getIn(['attributes', option.frameworkFilter]))
              .reduce(
                (memo, fw) => {
                  const id = `${option.path}_${fw.get('id')}`;
                  return memo.concat({
                    id, // filterOptionId
                    label: option.label,
                    message: (option.message && option.message.indexOf('{fwid}') > -1)
                      ? option.message.replace('{fwid}', fw.get('id'))
                      : option.message,
                    path: option.connectPath,
                    connection: option.path,
                    key: option.key,
                    ownKey: option.ownKey,
                    icon: id,
                    active: !!activeEditOption && activeEditOption.optionId === id,
                    create: { path: option.path },
                    color: option.path,
                  });
                },
                optionsMemo,
              );
          }
          return typeof option.edit === 'undefined' || option.edit
            ? optionsMemo.concat({
              id: option.path, // filterOptionId
              label: option.label,
              message: option.message,
              path: option.connectPath,
              connection: option.path,
              key: option.key,
              ownKey: option.ownKey,
              icon: option.path,
              active: !!activeEditOption && activeEditOption.optionId === option.path,
              create: { path: option.path },
            })
            : optionsMemo;
        },
        [],
      ),
    };
  }

  // attributes
  if (config.attributes) {
    // first prepare taxonomy options
    editGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(
        config.attributes.options,
        (optionsMemo, option) => {
          if (
            option.frameworkFilter
            && option.editForFrameworks
            && frameworks
            && !selectedFrameworks.every((fw) => fw.getIn(['attributes', option.frameworkFilter]))
          ) {
            return optionsMemo;
          }
          return (
            (typeof option.edit === 'undefined' || option.edit)
            && (typeof option.role === 'undefined' || hasUserRole[option.role])
          )
            ? optionsMemo.concat({
              id: option.attribute, // filterOptionId
              label: option.label,
              message: option.message,
              active: !!activeEditOption && activeEditOption.optionId === option.attribute,
            })
            : optionsMemo;
        },
        [],
      ),
    };
  }

  return editGroups;
};
