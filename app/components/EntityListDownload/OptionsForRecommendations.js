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
export function OptionsForRecommendations({
  attributes,
  setAttributes,
  hasAttributes,
  hasActions,
  actionsAsRows,
  setActiontypes,
  setActionsAsRows,
  actiontypes,
  // typeTitle,
  // intl,
}) {
  const [expandGroup, setExpandGroup] = useState(null);

  // count active export options
  const activeAttributeCount = hasAttributes && Object.keys(attributes).reduce((counter, attKey) => {
    if (attributes[attKey].active) return counter + 1;
    return counter;
  }, 0);

  const activeActiontypeCount = hasActions && Object.keys(actiontypes).reduce((counter, actiontypeId) => {
    if (actiontypes[actiontypeId].active) return counter + 1;
    return counter;
  }, 0);

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
};

export default OptionsForRecommendations;
