/*
 *
 * OptionsForActions
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';

import OptionGroup from './OptionGroup';

import { getActiveCount } from './utils';

export function OptionsForIndicators({
  attributes,
  setAttributes,
  hasAttributes,
}) {
  const [expandGroup, setExpandGroup] = useState(null);
  const activeAttributeCount = hasAttributes && getActiveCount(attributes);
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
    </Box>
  );
}
OptionsForIndicators.propTypes = {
  attributes: PropTypes.object,
  setAttributes: PropTypes.func,
  hasAttributes: PropTypes.bool,
  // taxonomies
  // hasTaxonomies: PropTypes.bool,
  // setTaxonomies: PropTypes.func,
  // taxonomyColumns: PropTypes.object,
  // setIncludeTaxonomies: PropTypes.func,
};

export default OptionsForIndicators;
