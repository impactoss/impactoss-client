import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { map, groupBy } from 'lodash/collection';

import Component from 'components/styled/Component';
import SupTitle from 'components/SupTitle';
import TaxonomySidebarItem from 'components/categoryList/TaxonomySidebarItem';

import SidebarHeader from 'components/styled/SidebarHeader';


import appMessages from 'containers/App/messages';

import messages from './messages';

const GroupLabel = styled.div`
  text-align: left;
  color: ${palette('asideListGroup', 0)};
  background-color: ${palette('asideListGroup', 1)};
  padding: 0.25em 1em 0.25em 1.5em;
  font-size: 0.9em;
  line-height: 1.64em;
`;

class TaxonomySidebar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const taxonomyGroups = groupBy(this.props.taxonomies, (tax) => tax.group && tax.group.id);

    return (
      <Component>
        <SidebarHeader>
          <SupTitle title={this.context.intl.formatMessage(messages.title)} />
        </SidebarHeader>
        {map(taxonomyGroups, (taxonomies, i) => (
          <div key={i}>
            <GroupLabel>
              <FormattedMessage {... appMessages.taxonomyGroups[i]} />
            </GroupLabel>
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
