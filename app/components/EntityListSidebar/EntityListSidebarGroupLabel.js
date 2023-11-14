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
  display: table;
  width: 100%;
  text-align: left;
  color: ${palette('asideListGroup', 0)};
  background-color: ${palette('asideListGroup', 1)};
  padding: 0.25em 8px 0.25em 16px;
  font-size: 0.9em;
  &:hover {
    color: ${palette('asideListGroupHover', 0)};
    background-color: ${palette('asideListGroupHover', 1)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0.25em 8px 0.25em 16px;
    font-size: 0.9em;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;
const GroupLabel = styled.div`
  display: table-cell;
  vertical-align: middle;
  width: 99%;
`;
const GroupIcon = styled.div`
  position: relative;
  right: 3px;
  display: table-cell;
  width: 26px;
  vertical-align: middle;
`;

class EntityListSidebarGroupLabel extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      label, icon, onToggle, expanded,
    } = this.props;
    const { intl } = this.context;
    return (
      <Styled
        onClick={onToggle}
        title={intl.formatMessage(
          expanded ? messages.groupExpand.hide : messages.groupExpand.show
        )}
      >
        <GroupLabel>{label}</GroupLabel>
        <GroupIcon><Icon name={icon} /></GroupIcon>
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
