/*
 *
 * OptionsForActions
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Text } from 'grommet';

// import { injectIntl, intlShape } from 'react-intl';

import OptionGroup from './OptionGroup';

import { getActiveCount } from './utils';
// import messages from './messages';

export function OptionsForActions({
  attributes,
  setAttributes,
  hasAttributes,
  hasRecommendations,
  // setRecommendationTypes,
  // recommendationTypes,
  setIncludeRecommendations,
  includeRecommendations,
  hasTaxonomies,
  setTaxonomies,
  taxonomyColumns,
  setIncludeTaxonomies,
  hasIndicators,
  indicatorsAsRows,
  setIndicatorsAsRows,
  indicatorsActive,
  setIndicatorsActive,
}) {
  const [expandGroup, setExpandGroup] = useState(null);

  const activeAttributeCount = hasAttributes && getActiveCount(attributes);
  // const activeRecommendationsCount = hasRecommendations && getActiveCount(recommendationTypes);
  // const activeActiontypeCount = hasActions && getActiveCount(actiontypes);
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
      {hasRecommendations && (
        <OptionGroup
          groupId="recommendations"
          label="Recommendations"
          expandedId={expandGroup}
          onExpandGroup={(val) => setExpandGroup(val)}
          activeOptionCount={includeRecommendations ? 1 : 0}
          optionCount={1}
          onSetActive={(val) => setIncludeRecommendations(val)}
          onActiveLabel="Include connected recommendations"
          optionListLabels={{
            attributes: 'Select recommendation type',
          }}
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
                {!indicatorsAsRows && ' Alternatively you can chose to include indicators as rows, resulting in one row per measure and indicator'}
                {indicatorsAsRows && ' Alternatively you can chose to include topics as rows, resulting in one row per activity, actor and indicator'}
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
            columns: 'Include indicators as columns (one column for each indicator)',
            rows: 'Include indicators as rows (one row for each activity and indicator)',
          }}
        />
      )}
    </Box>
  );
}
OptionsForActions.propTypes = {
  attributes: PropTypes.object,
  setAttributes: PropTypes.func,
  hasAttributes: PropTypes.bool,
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
  // recommendations
  setIncludeRecommendations: PropTypes.func,
  includeRecommendations: PropTypes.bool,
  hasRecommendations: PropTypes.bool,
};

export default OptionsForActions;
