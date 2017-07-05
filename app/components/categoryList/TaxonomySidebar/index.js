import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/styled/Component';
import SupTitle from 'components/SupTitle';
import TaxonomySidebarItem from 'components/categoryList/TaxonomySidebarItem';

import messages from './messages';

const Header = styled.div`
  padding: 3em 2em 1em;
  background-color: ${palette('light', 2)}
`;

class TaxonomySidebar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { taxonomies } = this.props;

    return (
      <Component>
        <Header>
          <SupTitle title={this.context.intl.formatMessage(messages.title)} />
        </Header>
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
