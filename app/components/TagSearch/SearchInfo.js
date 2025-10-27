/*
 *
 * SearchInfo
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Text,
} from 'grommet';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessages from 'containers/App/messages';
import messages from './messages';

const StyledLabel = styled((p) => <Text size="small" {...p} />)`
  color: ${palette('text', 1)};
`;
const UL = styled.ul`
  margin: 0;
`;

const SearchInfo = ({
  searchAttributes,
}) => (
  <Box gap="medium">
    {searchAttributes && searchAttributes.length > 0 && (
      <Box gap="xsmall">
        <Box>
          <StyledLabel size="medium" weight="bold">
            <FormattedMessage {...messages.searchInfoSectionAttributesTitle} />
          </StyledLabel>
        </Box>
        <Box>
          <StyledLabel>
            <FormattedMessage {...messages.searchInfoSectionAttributesInfo} />
          </StyledLabel>
        </Box>
        <Box>
          <UL>
            {searchAttributes
              .filter((att) => appMessages.attributes[att])
              .map((att) => (
                <li key={att}>
                  <StyledLabel>
                    <FormattedMessage {...appMessages.attributes[att]} />
                  </StyledLabel>
                </li>
              ))
            }
          </UL>
        </Box>
      </Box>
    )}
    <Box gap="xsmall">
      <Box>
        <StyledLabel size="medium" weight="bold">
          <FormattedMessage {...messages.searchInfoSectionBehaviourTitle} />
        </StyledLabel>
      </Box>
      <Box>
        <StyledLabel>
          <FormattedMessage {...messages.searchInfoSectionBehaviourInfo} />
        </StyledLabel>
      </Box>
      <Box>
        <UL>
          <li>
            <StyledLabel size="small">
              <FormattedMessage {...messages.searchInfoSectionBehaviourCapitalization} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel size="small">
              <FormattedMessage {...messages.searchInfoSectionBehaviourPartial} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel size="small">
              <FormattedMessage {...messages.searchInfoSectionBehaviourQuotes} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel size="small">
              <FormattedMessage {...messages.searchInfoSectionBehaviourMacrons} />
            </StyledLabel>
          </li>
        </UL>
      </Box>
    </Box>
  </Box>
);

SearchInfo.propTypes = {
  searchAttributes: PropTypes.array,
};

export default SearchInfo;
