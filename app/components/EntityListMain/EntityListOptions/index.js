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

import { PARAMS } from 'containers/App/constants';
import Button from 'components/buttons/Button';

import EntityListGroupBy from './EntityListGroupBy';

import messages from './messages';

const Styled = styled.div`
  padding: 0.25em 0;
  position: relative;
  min-height: 2em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    min-height: 2.65em;
    padding: 0.5em 0;
  }
`;
// TODO treat as regular link
const ListEntitiesHeaderOptionLink = styled(Button)`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0.5em;
    font-weight: 500;
    padding: 0 0.5em;
    color: ${palette('buttonFlat', 0)};
    &:hover {
      color: ${palette('buttonFlatHover', 0)};
    }
    &:last-child {
      padding: 0 0 0 0.5em;
    }
  }
  @media print {
    display: none;
  }
`;

export class EntityListOptions extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
      expandable,
      groupOptions,
      subgroupOptions,
    } = this.props;
    return (
      <Styled>
        { groupOptions.size > 0
          && (
            <EntityListGroupBy
              value={groupSelectValue}
              options={groupOptions
              && groupOptions.filter((option) => option.get('value') !== subgroupSelectValue).toJS()
              }
              onChange={onGroupSelect}
            />
          )
        }
        { groupSelectValue && groupSelectValue !== PARAMS.GROUP_RESET && subgroupOptions.size > 0
          && (
            <EntityListGroupBy
              value={subgroupSelectValue}
              options={subgroupOptions
              && subgroupOptions.filter((option) => option.get('value') !== groupSelectValue).toJS()
              }
              onChange={onSubgroupSelect}
              isSubgroup
            />
          )
        }
        { (expandable)
          && (
            <ListEntitiesHeaderOptionLink
              onClick={this.props.onExpand}
            >
              {
                !expanded
              && <FormattedMessage {...messages.expand} />
              }
              {
                expanded
              && <FormattedMessage {...messages.collapse} />
              }
            </ListEntitiesHeaderOptionLink>
          )
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
  expandable: PropTypes.bool,
};

export default EntityListOptions;
