/*
 *
 * TagSearch
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import styled from 'styled-components';
import { reduce } from 'lodash/collection';
import { Box } from 'grommet';

import appMessage from 'utils/app-message';
import { lowerCase } from 'utils/string';

import Icon from 'components/Icon';
import ButtonTagFilter from 'components/buttons/ButtonTagFilter';
import ButtonTagFilterInverse from 'components/buttons/ButtonTagFilterInverse';

import messages from './messages';

const Styled = styled((p) => <Box as="ul" direction="row" align="center" wrap {...p} />)`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const TagItem = styled.li`
  display: inline;
`;

const IconWrap = styled.div`
  display: inline-block;
  margin-right: 2px;
  position: relative;
  top: -1px;
  left: -1px;
  margin-left: -2px;
`;
const IconWrapClose = styled.div`
  display: inline-block;
  margin-right: -4px;
  margin-left: -2px;
  position: relative;
  top: 1px;
`;
const getLabels = (labels, intl, isLabel) => reduce(labels, (memo, label, i) => {
  if (!label.label) return memo;
  let labelValue = label.appMessage ? appMessage(intl, label.label) : label.label;
  labelValue = label.postfix ? `${labelValue}${label.postfix}` : labelValue;
  return `${memo}${label.lowerCase ? lowerCase(labelValue) : labelValue}${memo === '' && !isLabel && i !== labels.length - 1 ? ': ' : ''} `;
}, '').trim();

const getFilterLabel = (filter, intl, isLabel) => {
  // not used I think?
  // if (filter.message) {
  //   return filter.messagePrefix
  //     ? `${filter.messagePrefix} | ${lowerCase(appMessage(intl, filter.message))}`
  //     : appMessage(intl, filter.message);
  // }
  if (filter.labels) {
    return getLabels(filter.labels, intl, isLabel);
  }
  return filter.label;
};

const gerFilterButtonTitle = (filter, short, intl) => {
  let title = '';
  if (filter.titleLabels && !short) {
    title = getLabels(filter.titleLabels, intl, false);
  } else {
    title = filter.title || getFilterLabel(filter, intl, false);
  }
  // draft
  if (filter.inverse) {
    title = `${title} [draft]`;
  }
  return intl.formatMessage(messages.removeTag, { title });
};

const Tags = ({
  filters,
  lastFilterRef,
  focusLastFilter,
  intl,
}) => (
  <Styled as="ul" aria-label={`${filters.length} active filters`}>
    {filters.map((filter, i) => (
      <TagItem key={i}>
        {filter.inverse && (
          <ButtonTagFilterInverse
            ref={i === filters.length - 1 ? lastFilterRef : undefined}
            key={i}
            onClick={filter.onClick}
            palette={filter.type || 'attributes'}
            paletteHover={`${filter.type || 'attributes'}Hover`}
            pIndex={parseInt(filter.id, 10) || 0}
            disabled={!filter.onClick}
            title={gerFilterButtonTitle(filter, false, intl)}
            aria-label={gerFilterButtonTitle(filter, true, intl)}
            onKeyDown={(e) => {
              const key = e.keyCode || e.charCode;
              if (filter.onClick && key === 8) {
                filter.onClick();
                focusLastFilter();
              }
            }}
          >
            {filter.type === 'taxonomies' && (
              <IconWrap>
                <Icon name={`taxonomy_small_${filter.id}`} size="15px" />
              </IconWrap>
            )}
            {getFilterLabel(filter, intl, true)}
            {filter.onClick
              && <Icon name="removeSmall" text textRight hidePrint />
            }
          </ButtonTagFilterInverse>
        )}
        {!filter.inverse && (
          <ButtonTagFilter
            ref={i === filters.length - 1 ? lastFilterRef : undefined}
            key={i}
            onClick={filter.onClick}
            palette={filter.type || 'attributes'}
            paletteHover={`${filter.type || 'attributes'}Hover`}
            pIndex={parseInt(filter.id, 10) || 0}
            disabled={!filter.onClick}
            title={gerFilterButtonTitle(filter, false, intl)}
            aria-label={gerFilterButtonTitle(filter, true, intl)}
            onKeyDown={(e) => {
              const key = e.keyCode || e.charCode;
              if (filter.onClick && key === 8) {
                filter.onClick();
                focusLastFilter();
              }
            }}
          >
            <Box direction="row" align="center">
              {filter.type === 'taxonomies' && (
                <IconWrap>
                  <Icon
                    name={`taxonomy_small_${filter.id}`}
                    color="white"
                    size="15px"
                    aria-hidden="true"
                  />
                </IconWrap>
              )}
              {getFilterLabel(filter, intl, true)}
              {filter.onClick && (
                <IconWrapClose>
                  <Icon name="removeSmall" text textRight hidePrint />
                </IconWrapClose>
              )}
            </Box>
          </ButtonTagFilter>
        )}
      </TagItem>
    ))}
  </Styled>
);

Tags.propTypes = {
  filters: PropTypes.array,
  lastFilterRef: PropTypes.func,
  focusLastFilter: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Tags);
