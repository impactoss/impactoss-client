/*
 *
 * OptionsForEntityList
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';

import OptionGroup from './OptionGroup';

import { getActiveCount } from './utils';

export function OptionsForEntityList({
  attributes,
  connectionTypes,
  setAttributes,
  hasAttributes,
  includeConnections,
  setConnectionTypes,
  hasTaxonomies,
  setTaxonomies,
  taxonomyColumns,
  hasConnections,
}) {
  const [expandGroup, setExpandGroup] = useState(null);
  // count active export options
  const activeAttributeCount = hasAttributes && getActiveCount(attributes);
  const activeTaxonomyCount = hasTaxonomies && getActiveCount(taxonomyColumns);
  const activeConnectionsCount = hasConnections && getActiveCount(connectionTypes);

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
          label="Categories"
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
      {hasConnections && (
        <OptionGroup
          groupId="connections"
          label="Connections"
          expandedId={expandGroup}
          intro="The resulting CSV file will have one column for each type of connection"
          onExpandGroup={(val) => setExpandGroup(val)}
          activeOptionCount={activeConnectionsCount}
          optionCount={Object.keys(connectionTypes).length}
          active={includeConnections}
          options={connectionTypes}
          onSetOptions={(options) => setConnectionTypes(options)}
          optionListLabels={{
            attributes: 'Select connections',
          }}
        />
      )}
    </Box>
  );
}

OptionsForEntityList.propTypes = {
  // attributes
  attributes: PropTypes.object,
  setAttributes: PropTypes.func,
  hasAttributes: PropTypes.bool,
  // taxonomies
  hasTaxonomies: PropTypes.bool,
  setTaxonomies: PropTypes.func,
  taxonomyColumns: PropTypes.object,
  // connections
  hasConnections: PropTypes.bool,
  connectionTypes: PropTypes.object,
  includeConnections: PropTypes.bool,
  setConnectionTypes: PropTypes.func,
};

export default OptionsForEntityList;
