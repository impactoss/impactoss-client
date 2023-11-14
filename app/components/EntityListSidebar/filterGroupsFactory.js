import { reduce } from 'lodash/collection';
import { sortEntities } from 'utils/sort';
import { qe } from 'utils/quasi-equals';

const checkFramework = (frameworks, attribute) => frameworks.some((fw) => fw.getIn(['attributes', attribute]));

// figure out filter groups for filter panel
export const makeFilterGroups = (
  config,
  taxonomies,
  connectedTaxonomies,
  activeFilterOption,
  hasUserRole,
  messages,
  frameworks,
) => {
  const filterGroups = {};

  // taxonomy option group
  if (config.frameworks && frameworks && frameworks.size > 1) {
    filterGroups.frameworks = {
      id: 'frameworks', // filterGroupId
      label: messages.frameworksGroup,
      show: true,
      icon: 'recommendations',
      options: [{
        id: 'frameworks', // filterOptionId
        label: messages.frameworks,
        color: 'recommendations',
        active: !!activeFilterOption && activeFilterOption.optionId === 'frameworks',
      }],
    };
  }
  // taxonomy option group
  if (config.taxonomies && taxonomies) {
    // multi framework mode
    if (config.frameworks && frameworks && frameworks.size > 1) {
      // single framework taxonomy
      frameworks.forEach((fw) => {
        const fwTaxonomies = taxonomies.filter((tax) => {
          const taxFwIds = tax.get('frameworkIds');
          return taxFwIds.size === 1
              && taxFwIds.find((fwid) => qe(fwid, fw.get('id')));
        });
        filterGroups[`taxonomies_${fw.get('id')}`] = {
          id: `taxonomies_${fw.get('id')}`, // filterGroupId
          type: 'taxonomies',
          label: messages.taxonomyGroupByFw(fw.get('id')),
          show: true,
          icon: 'categories',
          options:
            sortEntities(fwTaxonomies, 'asc', 'priority')
              .reduce(
                (memo, taxonomy) => memo.concat([
                  {
                    id: taxonomy.get('id'), // filterOptionId
                    label: messages.taxonomies(taxonomy.get('id')),
                    active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
                    nested: taxonomy.getIn(['attributes', 'parent_id']),
                  },
                ]),
                [],
              ),
        };
      });
      const commonTaxonomies = taxonomies.filter((tax) => tax.get('frameworkIds')
          && tax.get('frameworkIds').size > 1);
      filterGroups.taxonomies = {
        id: 'taxonomies', // filterGroupId
        label: messages.taxonomyGroupByFw('common'),
        show: true,
        icon: 'categories',
        options:
          sortEntities(commonTaxonomies, 'asc', 'priority')
            .reduce(
              (memo, taxonomy) => memo.concat([
                {
                  id: taxonomy.get('id'), // filterOptionId
                  label: messages.taxonomies(taxonomy.get('id')),
                  active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
                  nested: taxonomy.getIn(['attributes', 'parent_id']),
                },
              ]),
              [],
            ),
      };
    } else {
      // first prepare taxonomy options
      filterGroups.taxonomies = {
        id: 'taxonomies', // filterGroupId
        label: messages.taxonomyGroup,
        show: true,
        icon: 'categories',
        options:
          sortEntities(taxonomies, 'asc', 'priority')
            .reduce(
              (memo, taxonomy) => memo.concat([
                {
                  id: taxonomy.get('id'), // filterOptionId
                  label: messages.taxonomies(taxonomy.get('id')),
                  active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
                  nested: taxonomy.getIn(['attributes', 'parent_id']),
                },
              ]),
              [],
            ),
      };
    }
  }

  // connectedTaxonomies option group
  if (config.connectedTaxonomies) {
    // first prepare taxonomy options
    filterGroups.connectedTaxonomies = {
      id: 'connectedTaxonomies', // filterGroupId
      label: messages.connectedTaxonomies,
      show: true,
      icon: 'connectedCategories',
      options:
        sortEntities(connectedTaxonomies, 'asc', 'priority')
          .reduce(
            (taxOptionsMemo, taxonomy) => (config.connectedTaxonomies.exclude
            && taxonomy.getIn(['attributes', config.connectedTaxonomies.exclude]))
              ? taxOptionsMemo
              : taxOptionsMemo.concat([
                {
                  id: taxonomy.get('id'), // filterOptionId
                  label: messages.taxonomies(taxonomy.get('id')),
                  active: !!activeFilterOption && activeFilterOption.optionId === taxonomy.get('id'),
                  nested: taxonomy.getIn(['attributes', 'parent_id']),
                },
              ]),
            [],
          ),
    };
  }

  // connections option group
  if (config.connections) {
    // first prepare taxonomy options
    filterGroups.connections = {
      id: 'connections', // filterGroupId
      label: messages.connections,
      show: true,
      options: reduce(
        config.connections.options,
        (optionsMemo, option) => {
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
                    icon: id,
                    color: option.path,
                    active: !!activeFilterOption && activeFilterOption.optionId === id,
                  });
                },
                optionsMemo,
              );
          }
          return optionsMemo.concat({
            id: option.path, // filterOptionId
            label: option.label,
            message: option.message,
            icon: option.path,
            active: !!activeFilterOption && activeFilterOption.optionId === option.path,
          });
        },
        [],
      ),
    };
  }

  // attributes
  if (config.attributes) {
    // first prepare taxonomy options
    filterGroups.attributes = {
      id: 'attributes', // filterGroupId
      label: messages.attributes,
      show: true,
      options: reduce(
        config.attributes.options,
        (options, option) => (
          (
            typeof option.role === 'undefined'
            || (hasUserRole && hasUserRole[option.role])
          )
          && (
            typeof option.frameworkFilter === 'undefined'
            || checkFramework(frameworks, option.frameworkFilter)
          )
        )
          ? options.concat([{
            id: option.attribute, // filterOptionId
            label: option.label,
            message: option.message,
            active: !!activeFilterOption && activeFilterOption.optionId === option.attribute,
          }])
          : options,
        [],
      ),
    };
  }

  return filterGroups;
};
