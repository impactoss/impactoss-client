import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { map, groupBy } from 'lodash/collection';

import Component from 'components/styled/Component';
import SupTitle from 'components/SupTitle';
import TaxonomySidebarItem from 'components/categoryList/TaxonomySidebarItem';

import SidebarHeader from 'components/styled/SidebarHeader';
import SidebarGroupLabel from 'components/styled/SidebarGroupLabel';


import appMessages from 'containers/App/messages';

import messages from './messages';

class TaxonomySidebar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const taxonomyGroups = groupBy(this.props.taxonomies, (tax) => tax.group && tax.group.id);

    return (
      <Component>
        <SidebarHeader responsiveSmall>
          <SupTitle title={this.context.intl.formatMessage(messages.title)} />
        </SidebarHeader>
        {map(taxonomyGroups, (taxonomies, i) => (
          <div key={i}>
            <SidebarGroupLabel>
              <FormattedMessage {... appMessages.taxonomyGroups[i]} />
            </SidebarGroupLabel>
            <div>
              {taxonomies.map((taxonomy, j) =>
                <TaxonomySidebarItem key={j} taxonomy={taxonomy} />
              )}
            </div>
          </div>
        ))}
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
