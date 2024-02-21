import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Link from 'containers/Link';
import { ROUTES } from 'containers/App/constants';

const ListEntitiesGroupHeaderWrapper = styled.div`
padding: ${({ separated }) => separated ? '5px 0 10px' : '0'};
margin-top: 10px;
@media print {
  margin-top: 20px;
  margin-bottom: 20px;
  page-break-inside: avoid;
  border-top: 1px solid ${palette('light', 1)};
}
`;

const ListEntitiesGroupHeaderLink = styled(Link)`
  color: ${palette('link', 2)};
  &:hover {
    color: ${palette('linkHover', 2)};
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

export class EntityListGroupHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { group, level } = this.props;

    if (group.get('id') === 'without') {
      return level === 1
        ? (

          <ListEntitiesGroupHeader>
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
        <ListEntitiesGroupHeaderWrapper>
          <ListEntitiesGroupHeaderLink to={`${ROUTES.CATEGORIES}/${group.get('id')}`}>
            <ListEntitiesGroupHeader>
              {group.get('label')}
            </ListEntitiesGroupHeader>
          </ListEntitiesGroupHeaderLink>
        </ListEntitiesGroupHeaderWrapper>
      )
      : (
        <ListEntitiesGroupHeaderWrapper>
          <ListEntitiesGroupHeaderLink to={`${ROUTES.CATEGORIES}/${group.get('id')}`}>
            <ListEntitiesSubgroupHeader>
              {group.get('label')}
            </ListEntitiesSubgroupHeader>
          </ListEntitiesGroupHeaderLink>
        </ListEntitiesGroupHeaderWrapper>
      );
  }
}
EntityListGroupHeader.propTypes = {
  group: PropTypes.object,
  level: PropTypes.number,
};
export default EntityListGroupHeader;
