/*
 *
 * EntityListOptions
 *
 */
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Button from 'components/buttons/Button';
import EntityListGroupBy from 'components/EntityListGroupBy';

import messages from './messages';

const Styled = styled.div`
  padding: 0.5em 0;
  position: relative;
`;

const ListEntitiesHeaderOptionLink = styled(Button)`
  position: absolute;
  right: 0;
  top: 0.5em;
  font-weight: bold;
  padding: 0 0.5em;
  color: ${palette('primary', 0)};
  &:hover {
    color: ${palette('primary', 1)};
  }
  &:last-child {
    padding: 0 0 0 0.5em;
  }
`;

export class EntityListOptions extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const {
      groupSelectValue,
      groupOptions,
      onGroupSelect,
      expandLink,
    } = this.props;

    return (
      <Styled>
        <EntityListGroupBy
          value={groupSelectValue}
          options={groupOptions}
          onChange={onGroupSelect}
        />
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
  groupOptions: PropTypes.array,
  onGroupSelect: PropTypes.func,
  expandLink: PropTypes.object,
};

export default EntityListOptions;
