/*
 *
 * EntityListOptions
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { filter } from 'lodash/collection';
import styled from 'styled-components';
import { palette } from 'styled-theme';

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
      groupOptions,
      onGroupSelect,
      onSubgroupSelect,
      expandLink,
    } = this.props;
    const subgroupOptions = filter(this.props.subgroupOptions, (option) => option.value !== groupSelectValue);
    const groupOptionsFiltered = filter(groupOptions, (option) => option.value !== subgroupSelectValue);
    return (
      <Styled>
        <EntityListGroupBy
          value={groupSelectValue}
          options={groupOptionsFiltered}
          onChange={onGroupSelect}
        />
        { groupSelectValue && subgroupOptions.length > 0 &&
          <EntityListGroupBy
            value={subgroupSelectValue}
            options={subgroupOptions}
            onChange={onSubgroupSelect}
            isSubgroup
          />
        }
        { expandLink &&
          <ListEntitiesHeaderOptionLink
            onClick={expandLink.onClick}
          >
            {
              !expandLink.expanded &&
              <FormattedMessage {...messages.expand} />
            }
            {
              expandLink.expanded &&
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
  groupOptions: PropTypes.array,
  subgroupOptions: PropTypes.array,
  onGroupSelect: PropTypes.func,
  onSubgroupSelect: PropTypes.func,
  expandLink: PropTypes.object,
};

export default EntityListOptions;