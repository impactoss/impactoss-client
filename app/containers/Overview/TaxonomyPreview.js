import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { injectIntl } from 'react-intl';
import { Box, ResponsiveContext } from 'grommet';
import styled, { withTheme } from 'styled-components';

import { ROUTES } from 'containers/App/constants';
import appMessages from 'containers/App/messages';

import { isMinSize } from 'utils/responsive';
import { truncateText } from 'utils/string';

import CardTeaser from 'components/CardTeaser';
import messages from './messages';

const Styled = styled((p) => <Box {...p} />)`
  max-width: 840px;
  margin-left: auto;
  margin-right: auto;
`;

const getRowIndex = (index, remainder, maxItems) => {
  if (remainder === 0 || maxItems === 2) return Math.floor(index / maxItems);
  return Math.floor((index + 1) / maxItems);
};

const splitIntoRows = (taxonomies, maxItems) => {
  const remainder = taxonomies.size % maxItems;
  return taxonomies
    .toList()
    .map((t, i) => t.set('rowIndex', getRowIndex(i, remainder, maxItems)))
    .groupBy((t) => t.get('rowIndex'));
};

export function TaxonomyPreview({
  taxonomies,
  onTaxonomyLink,
  intl,
  theme,
}) {
  const size = useContext(ResponsiveContext);
  // if < small
  let rowMax = 1;
  if (isMinSize(size, 'medium')) {
    rowMax = 3;
  } else if (isMinSize(size, 'small')) {
    rowMax = 2;
  }
  const rows = taxonomies && splitIntoRows(taxonomies, rowMax);
  return (
    <Styled gap="xxlarge" margin={{ vertical: 'xxlarge' }}>
      {rows.entrySeq().map(([rowIndex, row]) => (
        <Box key={rowIndex} direction="row" gap="ms">
          {row.valueSeq().map((taxonomy) => {
            const title = intl.formatMessage(appMessages.entities.taxonomies[taxonomy.get('id')].plural);
            const description = truncateText(
              intl.formatMessage(appMessages.entities.taxonomies[taxonomy.get('id')].teaser), 160,
            );
            const explore = intl.formatMessage(messages.buttons.teaserSelect);
            return (
              <CardTeaser
                key={taxonomy.get('id')}
                title={title}
                description={description}
                explore={explore}
                ariaLabel={`${explore}: ${title} - ${description}`}
                basis={`1/${row.size}`}
                taxonomy={taxonomy}
                onClick={(e) => {
                  if (e) e.preventDefault();
                  onTaxonomyLink(`${ROUTES.TAXONOMIES}/${taxonomy.get('id')}`);
                }}
                path={`${ROUTES.TAXONOMIES}/${taxonomy.get('id')}`}
                isHome={false}
                colors={[
                  theme.palette.taxonomies[parseInt(taxonomy.get('id'), 10)],
                  theme.palette.taxonomiesHover[parseInt(taxonomy.get('id'), 10)],
                ]}
                icon={`taxonomy_${taxonomy.get('id')}`}
              />
            );
          })}
        </Box>
      ))}
    </Styled>
  );
}

TaxonomyPreview.propTypes = {
  taxonomies: PropTypes.instanceOf(Map),
  onTaxonomyLink: PropTypes.func,
  theme: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(withTheme(TaxonomyPreview));
