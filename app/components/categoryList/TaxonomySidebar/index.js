import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';

import { map, groupBy } from 'lodash/collection';

import { VIEWPORTS } from 'containers/App/constants';

import SupTitle from 'components/SupTitle';
import TaxonomySidebarItem from 'components/categoryList/TaxonomySidebarItem';
import Icon from 'components/Icon';

import Button from 'components/buttons/Button';
import ButtonDefault from 'components/buttons/ButtonDefault';

import Component from 'components/styled/Component';
import SidebarHeader from 'components/styled/SidebarHeader';
import SidebarGroupLabel from 'components/styled/SidebarGroupLabel';
import Sidebar from 'components/styled/Sidebar';
import Scrollable from 'components/styled/Scrollable';


import appMessages from 'containers/App/messages';

import messages from './messages';

const ToggleShow = styled(ButtonDefault)`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
  padding: 0.75em 1em;
  letter-spacing: 0;
  border-radius: 0;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
  font-size: 0.85em;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    width: ${(props) => props.theme.sizes.aside.width.large}px;
  }
`;

const ToggleHide = styled(Button)`
  position: absolute;
  right:0;
  top:0;
`;

const STATE_INITIAL = {
  visible: false,
};

class TaxonomySidebar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = STATE_INITIAL;
  }
  componentWillMount() {
    this.setState(STATE_INITIAL);
  }
  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }
  onShowSidebar = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ visible: true });
  };
  onHideSidebar = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ visible: false });
  };
  updateViewport() {
    let viewport = VIEWPORTS.MOBILE;
    if (window.innerWidth >= parseInt(this.props.theme.breakpoints.large, 10)) {
      viewport = VIEWPORTS.LARGE;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.medium, 10)) {
      viewport = VIEWPORTS.MEDIUM;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.small, 10)) {
      viewport = VIEWPORTS.SMALL;
    }
    this.setState({ viewport });
  }
  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
  };

  render() {
    const taxonomyGroups = groupBy(this.props.taxonomies, (tax) => tax.group && tax.group.id);

    return (
      <div>
        { (!this.state.visible && this.state.viewport < VIEWPORTS.SMALL) &&
          <ToggleShow onClick={this.onShowSidebar}>
            <FormattedMessage {...messages.show} />
          </ToggleShow>
        }
        { (this.state.visible || this.state.viewport >= VIEWPORTS.SMALL) &&
          <Sidebar responsiveSmall>
            <Scrollable>
              <Component>
                <SidebarHeader responsiveSmall>
                  <SupTitle title={this.context.intl.formatMessage(messages.title)} />
                  { this.state.viewport < VIEWPORTS.SMALL &&
                    <ToggleHide onClick={this.onHideSidebar} >
                      <Icon name="close" />
                    </ToggleHide>
                  }
                </SidebarHeader>
                {map(taxonomyGroups, (taxonomies, i) => (
                  <div key={i}>
                    <SidebarGroupLabel>
                      <FormattedMessage {... appMessages.taxonomyGroups[i]} />
                    </SidebarGroupLabel>
                    <div>
                      {taxonomies.map((taxonomy, j) =>
                        <TaxonomySidebarItem key={j} taxonomy={taxonomy} onTaxonomyClick={this.onHideSidebar} />
                      )}
                    </div>
                  </div>
                ))}
              </Component>
            </Scrollable>
          </Sidebar>
        }
      </div>
    );
  }
}

TaxonomySidebar.propTypes = {
  taxonomies: PropTypes.array,
  theme: PropTypes.object,
};
TaxonomySidebar.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default withTheme(TaxonomySidebar);
