/*
 *
 * EntityListSidebarLoading
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Scrollable from 'components/styled/Scrollable';
import Sidebar from 'components/styled/Sidebar';
import SidebarHeader from 'components/styled/SidebarHeader';
import PrintHide from 'components/styled/PrintHide';

const Styled = styled(PrintHide)`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: ${(props) => props.responsiveSmall ? 'block' : 'none'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    display: block;
  }
`;

const Group = styled.div`
  height: 28px;
  display: block;
  width: 100%;
  background-color: ${palette('light', 1)};
  margin-bottom: 1px;
`;

const Option = styled.div`
  height: 30px;
  font-weight: bold;
  padding: 0.5em 8px 0.5em 12px;
  width: 100%;
  background-color: ${palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 1em 8px 1em 24px;
    height: 50px;
  }
`;

const Label = styled.div`
  background-color: ${palette('light', 3)};
  height: 0.85em;
  width: ${(props) => props.width}%;
`;

const ScrollableWrapper = styled(Scrollable)`
  background-color: ${palette('background', 0)};
`;

export class EntityListSidebarLoading extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Styled responsiveSmall={this.props.responsiveSmall}>
        <Sidebar responsiveSmall={this.props.responsiveSmall}>
          <ScrollableWrapper>
            <SidebarHeader />
            <Group />
            <Option><Label width={30} /></Option>
            <Option><Label width={35} /></Option>
            <Group />
            <Option><Label width={20} /></Option>
            <Option><Label width={25} /></Option>
          </ScrollableWrapper>
        </Sidebar>
      </Styled>
    );
  }
}

EntityListSidebarLoading.propTypes = {
  responsiveSmall: PropTypes.bool,
};

EntityListSidebarLoading.defaultProps = {
  responsiveSmall: false,
};

export default EntityListSidebarLoading;
