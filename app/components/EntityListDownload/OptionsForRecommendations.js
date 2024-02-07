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
import { getActiveCount } from './utils';

export function OptionsForRecommendations({
  attributes,
  setAttributes,
  hasAttributes,
  hasActions,
  setIncludeActions,
  includeActions,
  hasTaxonomies,
  setTaxonomies,
  setIncludeTaxonomies,
  taxonomyColumns,
  hasIndicators,
  indicatorsAsRows,
  setIndicatorsAsRows,
  indicatorsActive,
  setIndicatorsActive,
}) {
  const [expandGroup, setExpandGroup] = useState(null);

  // count active export options
  const activeAttributeCount = hasAttributes && getActiveCount(attributes);
  // const activeActionsCount = hasActions && getActiveCount(actiontypes);
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
          activeOptionCount={includeActions ? 1 : 0}
          optionCount={1}
          active={includeActions}
          onActiveLabel="Include connected actions"
          onSetActive={(val) => setIncludeActions(val)}
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
          onSetActive={(val) => setIncludeTaxonomies(val)}
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
  // attributes
  attributes: PropTypes.object,
  setAttributes: PropTypes.func,
  hasAttributes: PropTypes.bool,
  // actions
  // actiontypes: PropTypes.object,
  hasActions: PropTypes.bool,
  includeActions: PropTypes.bool,
  // setActiontypes: PropTypes.func,
  // actionsAsRows: PropTypes.bool,
  // setActionsAsRows: PropTypes.func,
  setIncludeActions: PropTypes.func,
  // taxonomies
  hasTaxonomies: PropTypes.bool,
  setTaxonomies: PropTypes.func,
  taxonomyColumns: PropTypes.object,
  setIncludeTaxonomies: PropTypes.func,
  // indicators
  indicatorsAsRows: PropTypes.bool,
  setIndicatorsAsRows: PropTypes.func,
  indicatorsActive: PropTypes.bool,
  setIndicatorsActive: PropTypes.func,
  hasIndicators: PropTypes.bool,
};

export default OptionsForRecommendations;
