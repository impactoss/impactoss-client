import React from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';
import SupTitle from 'components/SupTitle';
import TaxonomySidebarItem from 'components/categoryList/TaxonomySidebarItem';

import SidebarHeader from 'components/styled/SidebarHeader';

import messages from './messages';

class TaxonomySidebar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { taxonomies } = this.props;

    return (
      <Component>
        <SidebarHeader>
          <SupTitle title={this.context.intl.formatMessage(messages.title)} />
        </SidebarHeader>
        {taxonomies.map((taxonomy, i) =>
          <TaxonomySidebarItem key={i} taxonomy={taxonomy} />
        )}
      </Component>
    );
  }
}

TaxonomySidebar.propTypes = {
  taxonomies: PropTypes.array,
};
TaxonomySidebar.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default TaxonomySidebar;
