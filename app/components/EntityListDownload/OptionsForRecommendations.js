/*
 *
 * OptionsForIndicators
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Text } from 'grommet';

// import { injectIntl, intlShape } from 'react-intl';

import OptionGroup from './OptionGroup';

// import messages from './messages';

const getActiveCount = (types) => Object.keys(types).reduce((counter, attKey) => {
  if (types[attKey].active) return counter + 1;
  return counter;
}, 0);
export function OptionsForRecommendations({
  // attributes
  attributes,
  setAttributes,
  hasAttributes,
  // actions
  hasActions,
  actionsAsRows,
  setActiontypes,
  setActionsAsRows,
  actiontypes,
  // taxonomies
  hasTaxonomies,
  setTaxonomies,
  taxonomyColumns,
  // indicators
  hasIndicators,
  indicatorsAsRows,
  setIndicatorsAsRows,
  indicatorsActive,
  setIndicatorsActive,

  // typeTitle,
  // intl,
}) {
  const [expandGroup, setExpandGroup] = useState(null);

  // count active export options
  const activeAttributeCount = hasAttributes && getActiveCount(attributes);
  const activeActiontypeCount = hasActions && getActiveCount(actiontypes);
  const activeTaxonomyCount = hasTaxonomies && getActiveCount(taxonomyColumns);

  return (
    <Box margin={{ bottom: 'large' }}>
      {hasAttributes && (
        <OptionGroup
          groupId="attributes"
          label="Attributes"
          expandedId={expandGroup}
          onExpandGroup={(val) => setExpandGroup(val)}
          activeOptionCount={activeAttributeCount}
          optionCount={Object.keys(attributes).length}
          intro="The resulting CSV file will have one column for each attribute selected"
          options={attributes}
          optionListLabels={{
            attributes: 'Select attributes',
            columns: 'Customise column name',
          }}
          onSetOptions={(options) => setAttributes(options)}
          editColumnNames
        />
      )}
      {hasActions && (
        <OptionGroup
          groupId="actions"
          label="Actions"
          expandedId={expandGroup}
          onExpandGroup={(val) => setExpandGroup(val)}
          activeOptionCount={activeActiontypeCount}
          optionCount={Object.keys(actiontypes).length}
          introNode={(
            <Box gap="small">
              <Text size="small">
                By default, the resulting CSV file will have one column for each type of activity selected.
                Alternatively you can chose to include activities as rows, resulting in one row per actor and activity
              </Text>
            </Box>
          )}
          options={actiontypes}
          optionListLabels={{
            attributes: 'Select activity types',
          }}
          onSetOptions={(options) => setActiontypes(options)}
          onSetAsRows={(val) => setActionsAsRows(val)}
          asRows={actionsAsRows}
          asRowsDisabled={activeActiontypeCount === 0}
          asRowsLabels={{
            columns: 'Include activities as columns (one column for each activity type)',
            rows: 'Include activities as rows (one row for each actor and activity)',
          }}
        />
      )}
      {hasTaxonomies && (
        <OptionGroup
          groupId="taxonomies"
          label="Taxonomies"
          expandedId={expandGroup}
          onExpandGroup={(val) => setExpandGroup(val)}
          activeOptionCount={activeTaxonomyCount}
          optionCount={Object.keys(taxonomyColumns).length}
          intro="The resulting CSV file will have one column for each category group (taxonomy) selected"
          options={taxonomyColumns}
          optionListLabels={{
            attributes: 'Select category groups',
            columns: 'Customise column name',
          }}
          onSetOptions={(options) => setTaxonomies(options)}
          editColumnNames
        />
      )}
      {hasIndicators && (
        <OptionGroup
          groupId="indicators"
          label="Indicators"
          expandedId={expandGroup}
          onExpandGroup={(val) => setExpandGroup(val)}
          activeOptionCount={indicatorsActive ? 1 : 0}
          optionCount={1}
          introNode={(
            <Box gap="xsmall">
              <Text size="small">
                By default, the resulting CSV file will have one column for each indicator.
              </Text>
            </Box>
          )}
          active={indicatorsActive}
          onSetActive={(val) => setIndicatorsActive(val)}
          onActiveLabel="Include indicators"
          onSetAsRows={(val) => setIndicatorsAsRows(val)}
          asRows={indicatorsAsRows}
          asRowsDisabled={!indicatorsActive}
          asRowsLabels={{
            columns: 'Include topics as columns (one column for each indicator)',
            rows: indicatorsAsRows
              ? 'Include indicators as rows (one row for each activity, actor and indicators)'
              : 'Include indicators as rows (one row for each activity and topic)',
          }}
        />
      )}
    </Box>
  );
}

OptionsForRecommendations.propTypes = {
  // intl: intlShape.isRequired,
  // attributes
  attributes: PropTypes.object,
  setAttributes: PropTypes.func,
  hasAttributes: PropTypes.bool,
  // actions
  actiontypes: PropTypes.object,
  hasActions: PropTypes.bool,
  setActiontypes: PropTypes.func,
  actionsAsRows: PropTypes.bool,
  setActionsAsRows: PropTypes.func,
  // taxonomies
  hasTaxonomies: PropTypes.bool,
  setTaxonomies: PropTypes.func,
  taxonomyColumns: PropTypes.object,
  // indicators
  indicatorsAsRows: PropTypes.bool,
  setIndicatorsAsRows: PropTypes.func,
  indicatorsActive: PropTypes.bool,
  setIndicatorsActive: PropTypes.func,
  hasIndicators: PropTypes.bool,
};

export default OptionsForRecommendations;
