import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import ScreenReaderHide from 'components/styled/ScreenReaderHide';

import Link from 'containers/Link';
import { ROUTES } from 'containers/App/constants';

import messages from './messages';

const ListEntitiesGroupHeaderWrapper = styled.div`
padding: ${({ separated }) => separated ? '5px 0 10px' : '0'};
margin-top: 10px;
@media print {
  margin-top: 20px;
  margin-bottom: 20px;
  page-break-inside: avoid;
}
`;

const ListEntitiesGroupHeaderLink = styled(Link)`
  color: ${palette('link', 2)};
  &:hover, &:focus-visible {
    color: ${palette('linkHover', 2)};
  }
  &:focus-visible {
    text-decoration: underline;
  }
`;

const ListEntitiesGroupHeader = styled.h3`
  margin-top: 15px;
  margin-bottom: 5px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 30px;
    margin-bottom: 8px;
  }
`;
const ListEntitiesSubgroupHeader = styled.h5`
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 5px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 20px;
    margin-bottom: 8px;
  }
`;
const Divider = styled.div`
  width: 100%;
  border-bottom: 1px solid ${palette('light', 3)};
  @media print {
    display: none;
  }
`;
export class EntityListGroupHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      group, level, expanded, groupTypeTitle, intl,
    } = this.props;

    if (group.get('id') === 'without') {
      return level === 1
        ? (
          <ListEntitiesGroupHeader id={`list-group-${group.get('id')}`}>
            {group.get('label')}
          </ListEntitiesGroupHeader>
        )
        : (
          <ListEntitiesSubgroupHeader>
            {group.get('label')}
          </ListEntitiesSubgroupHeader>
        );
    }
    return level === 1
      ? (
        <ListEntitiesGroupHeaderLink
          id={`list-group-${group.get('id')}`}
          to={`${ROUTES.CATEGORIES}/${group.get('id')}`}
          title={intl.formatMessage(
            messages.groupHeaderTitle,
            { label: group.get('label'), type: groupTypeTitle }
          )}
        >
          <ScreenReaderHide>
            <ListEntitiesGroupHeader>
              {group.get('label')}
            </ListEntitiesGroupHeader>
          </ScreenReaderHide>
        </ListEntitiesGroupHeaderLink>
      )
      : (
        <ListEntitiesGroupHeaderWrapper>
          <ListEntitiesGroupHeaderLink
            to={`${ROUTES.CATEGORIES}/${group.get('id')}`}
            title={intl.formatMessage(
              messages.subgroupHeaderTitle,
              { label: group.get('label'), type: groupTypeTitle }
            )}
          >
            <ScreenReaderHide>
              <ListEntitiesSubgroupHeader>
                {group.get('label')}
              </ListEntitiesSubgroupHeader>
            </ScreenReaderHide>
          </ListEntitiesGroupHeaderLink>
          {expanded && <Divider />}
        </ListEntitiesGroupHeaderWrapper>
      );
  }
}
EntityListGroupHeader.propTypes = {
  group: PropTypes.object,
  level: PropTypes.number,
  expanded: PropTypes.bool,
  groupTypeTitle: PropTypes.string,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(EntityListGroupHeader);
