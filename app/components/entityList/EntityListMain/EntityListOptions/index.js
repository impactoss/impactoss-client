/*
 *
 * EntityListOptions
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { List } from 'immutable';

import { isEqual } from 'lodash/lang';

import Button from 'components/buttons/Button';
import EntityListGroupBy from './EntityListGroupBy';

import messages from './messages';

const Styled = styled.div`
  padding: 0.5em 0;
  position: relative;
`;
// TODO treat as regular link
const ListEntitiesHeaderOptionLink = styled(Button)`
  position: absolute;
  right: 0;
  top: 0.5em;
  font-weight: bold;
  padding: 0 0.5em;
  color: ${palette('linkDefault', 0)};
  &:hover {
    color: ${palette('linkDefaultHover', 0)};
  }
  &:last-child {
    padding: 0 0 0 0.5em;
  }
`;

export class EntityListOptions extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    // console.log('EntityListOptions.render')

    const {
      groupSelectValue,
      subgroupSelectValue,
      onGroupSelect,
      onSubgroupSelect,
      expanded,
      collapsed,
    } = this.props;

    const groupOptions = this.props.groupOptions
    && this.props.groupOptions.filter((option) => option.get('value') !== subgroupSelectValue);
    const subgroupOptions = this.props.subgroupOptions
    && this.props.subgroupOptions.filter((option) => option.get('value') !== groupSelectValue);
    return (
      <Styled>
        <EntityListGroupBy
          value={groupSelectValue}
          options={groupOptions.toJS()}
          onChange={onGroupSelect}
        />
        { groupSelectValue && subgroupOptions.size > 0 &&
          <EntityListGroupBy
            value={subgroupSelectValue}
            options={subgroupOptions.toJS()}
            onChange={onSubgroupSelect}
            isSubgroup
          />
        }
        { (expanded !== collapsed) &&
          <ListEntitiesHeaderOptionLink
            onClick={this.props.onExpand}
          >
            {
              !expanded &&
              <FormattedMessage {...messages.expand} />
            }
            {
              expanded &&
              <FormattedMessage {...messages.collapse} />
            }
          </ListEntitiesHeaderOptionLink>
        }
      </Styled>
    );
  }
}

EntityListOptions.propTypes = {
  groupSelectValue: PropTypes.string,
  subgroupSelectValue: PropTypes.string,
  groupOptions: PropTypes.instanceOf(List),
  subgroupOptions: PropTypes.instanceOf(List),
  onGroupSelect: PropTypes.func,
  onSubgroupSelect: PropTypes.func,
  onExpand: PropTypes.func,
  expanded: PropTypes.bool,
  collapsed: PropTypes.bool,
};

export default EntityListOptions;
