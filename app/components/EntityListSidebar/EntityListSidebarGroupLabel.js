/*
 *
 * EntityListSidebarGroupLabel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import messages from './messages';

const Styled = styled(Button)`
  display: block;
  width: 100%;
  text-align: left;
  color: ${palette('dark', 2)};
  background-color: ${palette('light', 1)};
  padding: 0.5em 1em 0.5em 1.5em;
  &:hover {
    color: ${palette('dark', 3)};
  }
`;
const GroupIcon = styled.div`
  color: ${palette('dark', 4)};
  float: right;
  position: relative;
  right: 1px;
`;

class EntityListSidebarGroupLabel extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { label, icon, onToggle, expanded } = this.props;

    return (
      <Styled
        onClick={onToggle}
        title={this.context.intl.formatMessage(
          expanded ? messages.groupExpand.hide : messages.groupExpand.show
        )}
      >
        {label}
        <GroupIcon><Icon name={icon} text /></GroupIcon>
      </Styled>
    );
  }
}

EntityListSidebarGroupLabel.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onToggle: PropTypes.func,
  expanded: PropTypes.bool,
};

EntityListSidebarGroupLabel.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListSidebarGroupLabel;
