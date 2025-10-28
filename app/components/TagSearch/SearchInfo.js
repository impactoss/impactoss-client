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

import FormattedMessageMarkdown from 'components/FormattedMessageMarkdown';
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
            <FormattedMessageMarkdown message={messages.searchInfoSectionAttributesTitle} />
          </StyledLabel>
        </Box>
        <Box>
          <StyledLabel>
            <FormattedMessageMarkdown message={messages.searchInfoSectionAttributesInfo} />
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
          <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourTitle} />
        </StyledLabel>
      </Box>
      <Box>
        <UL>
          <li>
            <StyledLabel>
              <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourCapitalization} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel>
              <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourDeburr} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel>
              <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourAllTerms} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel>
              <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourPartial} />
            </StyledLabel>
          </li>
          <li>
            <StyledLabel>
              <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourQuotes} />
            </StyledLabel>
          </li>
        </UL>
      </Box>
    </Box>
  </Box>
);
// <Box>
//   <StyledLabel>
//     <FormattedMessageMarkdown message={messages.searchInfoSectionBehaviourInfo} />
//   </StyledLabel>
// </Box>
SearchInfo.propTypes = {
  searchAttributes: PropTypes.array,
};

export default SearchInfo;
