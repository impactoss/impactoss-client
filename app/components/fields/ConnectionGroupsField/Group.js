import React from 'react';
import Link from 'containers/Link';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import appMessages from 'containers/App/messages';
import EntityListItems from 'components/EntityListMain/EntityListGroups/EntityListItems';

// import EntityListItemsWrap from 'components/fields/EntityListItemsWrap';
import ToggleAllItems from 'components/fields/ToggleAllItems';
import EmptyHint from 'components/fields/EmptyHint';
import { getCategoryTitle } from 'utils/entities';

const CONNECTIONMAX = 5;

const GroupHeaderLink = styled(Link)`
  color: ${palette('link', 2)};
  &:hover {
    color: ${palette('linkHover', 2)};
  }
`;

const GroupHeader = styled.h6`
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 5px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 40px;
    margin-bottom: 10px;
  }
`;


class Group extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = { showAllConnections: false };
  }

  render() {
    const { field, group } = this.props;
    const size = group.get(field.entityPath) ? group.get(field.entityPath).size : 0;

    return (
      <div>
        <GroupHeaderLink to={`/category/${group.get('id')}`}>
          <GroupHeader>
            {getCategoryTitle(group)}
          </GroupHeader>
        </GroupHeaderLink>
        <EntityListItems
          taxonomies={field.taxonomies}
          connections={field.connections}
          config={{ connections: { options: field.connectionOptions } }}
          entities={
            this.state.showAllConnections
              ? group.get(field.entityPath)
              : (group.get(field.entityPath).slice(0, CONNECTIONMAX)).toList()
          }
          entityIcon={field.entityIcon}
          onEntityClick={field.onEntityClick}
          entityPath={field.entityPath}
          isConnection
        />
        { size > CONNECTIONMAX
          && (
            <ToggleAllItems
              onClick={() => this.setState(
                (prevState) => (
                  { showAllConnections: !prevState.showAllConnections }
                )
              )}
            >
              { this.state.showAllConnections
              && <FormattedMessage {...appMessages.entities.showLess} />
              }
              { !this.state.showAllConnections
              && <FormattedMessage {...appMessages.entities.showAll} />
              }
            </ToggleAllItems>
          )
        }
        { (size === 0)
          && (
            <EmptyHint>
              <FormattedMessage {...field.showEmpty} />
            </EmptyHint>
          )
        }
      </div>
    );
  }
}

Group.propTypes = {
  field: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
};
Group.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Group;
