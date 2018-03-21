/*
 *
 * EntityListSidebarLoading
 *
 */
import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Scrollable from 'components/styled/Scrollable';
import Sidebar from 'components/styled/Sidebar';
import SidebarHeader from 'components/styled/SidebarHeader';

const Group = styled.div`
  height: 31px;
  display: block;
  width: 100%;
  background-color: ${palette('asideListGroup', 1)};
  padding: 0.5em 1em 0.5em 1.5em;
  margin-bottom: 1px;
`;
// TODO @tmfrnz config
// background color

const Option = styled.div`
  height: 50px;
  font-weight: bold;
  padding: 1em 1em 0 1.5em;
  width: 100%;
  background-color: ${palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
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
      <div>
        <Sidebar>
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
      </div>
    );
  }
}

export default EntityListSidebarLoading;
