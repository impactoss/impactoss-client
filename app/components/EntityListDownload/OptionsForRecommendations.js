/*
 *
 * OptionsForIndicators
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';

import { injectIntl, intlShape } from 'react-intl';

import OptionGroup from './OptionGroup';

import messages from './messages';
export function OptionsForRecommendations({
  attributes,
  setAttributes,
  hasAttributes,
  intl,
}) {
  const [expandGroup, setExpandGroup] = useState(null);

  // count active export options
  const activeAttributeCount = hasAttributes && Object.keys(attributes).reduce((counter, attKey) => {
    if (attributes[attKey].active) return counter + 1;
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
            attributes: intl.formatMessage(messages.optionGroups.listLabelAttributes.attributes),
            columns: intl.formatMessage(messages.optionGroups.listLabelColumns),
          }}
          onSetOptions={(options) => setAttributes(options)}
          editColumnNames
        />
      )}
    </Box>
  );
}

OptionsForRecommendations.propTypes = {
  intl: intlShape.isRequired,
  attributes: PropTypes.object,
  setAttributes: PropTypes.func,
  hasAttributes: PropTypes.bool,
};

export default injectIntl(OptionsForRecommendations);
