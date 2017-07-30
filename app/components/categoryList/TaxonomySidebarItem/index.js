import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import appMessages from 'containers/App/messages';

// TODO compare EntityListSidebarOption
const Styled = styled(Button)`
  padding: 1em;
  width: 100%;
  padding: 1em 0.5em 0.5em;
  text-align: left;
  font-size: 0.85em;
  color:  ${(props) => props.active ? palette('asideCatNavItem', 1) : palette('asideCatNavItem', 0)};
  background-color: ${(props) => props.active ? palette('asideCatNavItem', 3) : palette('asideCatNavItem', 2)};
  border-bottom: 1px solid ${palette('asideCatNavItem', 4)};
  &:hover {
    color: ${(props) => props.active ? palette('asideCatNavItemHover', 1) : palette('asideCatNavItemHover', 0)};
    background-color: ${(props) => props.active ? palette('asideCatNavItemHover', 3) : palette('asideCatNavItemHover', 2)};
    border-bottom-color: ${palette('asideCatNavItemHover', 4)}
  }
`;

const TaxTitle = styled.span`
  font-weight: bold;
`;
const TaxIcon = styled.span`
  padding: 0 1em 0 0.75em;
`;

class TaxonomySidebarItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getTaxTitle = (id) =>
    this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);

  render() {
    const { taxonomy } = this.props;
    return (
      <Styled onClick={() => taxonomy.onLink()} active={taxonomy.active}>
        <TaxIcon>
          <Icon name={`taxonomy_${taxonomy.id}`} />
        </TaxIcon>
        <TaxTitle>
          {this.getTaxTitle(taxonomy.id)}
        </TaxTitle>
      </Styled>
    );
  }
}

TaxonomySidebarItem.propTypes = {
  taxonomy: PropTypes.object,
};

TaxonomySidebarItem.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TaxonomySidebarItem;
