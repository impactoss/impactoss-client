import { Link } from 'react-router';
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const ListEntitiesGroupHeaderLink = styled(Link)`
  color: ${palette('dark', 1)};
  &:hover {
    color: ${palette('dark', 0)};
    text-decoration: underline;
  }
`;


const ListEntitiesGroupHeader = styled.h3`
  margin-top: 30px;
`;
const ListEntitiesSubgroupHeader = styled.h5`
  margin-top: 12px;
  font-weight: normal;
  margin-bottom: 20px;
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
      <ListEntitiesGroupHeaderLink to={`category/${group.get('id')}`}>
        <ListEntitiesGroupHeader>
          {group.get('label')}
        </ListEntitiesGroupHeader>
      </ListEntitiesGroupHeaderLink>
    )
    : (
      <ListEntitiesGroupHeaderLink to={`category/${group.get('id')}`}>
        <ListEntitiesSubgroupHeader>
          {group.get('label')}
        </ListEntitiesSubgroupHeader>
      </ListEntitiesGroupHeaderLink>
    );
  }
}
EntityListGroupHeader.propTypes = {
  group: PropTypes.object,
  level: PropTypes.number,
};
export default EntityListGroupHeader;
