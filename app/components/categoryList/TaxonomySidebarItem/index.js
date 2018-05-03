import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import appMessages from 'containers/App/messages';

// TODO compare EntityListSidebarOption
const Styled = styled(Button)`
  display: table;
  table-layout: fixed;
  width: 100%;
  padding: 0.3em 8px 0.3em 12px;
  text-align: left;
  color:  ${(props) => props.active ? palette('asideCatNavItem', 1) : palette('asideCatNavItem', 0)};
  background-color: ${(props) => props.active ? palette('taxonomies', props.paletteId) : palette('asideCatNavItem', 2)};
  border-bottom: 1px solid ${palette('asideCatNavItem', 4)};
  &:hover {
    color: ${palette('asideCatNavItemHover', 1)};
    background-color: ${(props) => props.active ? palette('taxonomiesHover', props.paletteId) : palette('taxonomies', props.paletteId)};
    border-bottom-color: ${palette('asideCatNavItemHover', 4)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0.5em 8px 0.5em 24px
  }
`;

const TaxTitle = styled.div`
  font-weight: bold;
  vertical-align: middle;
  display: table-cell;
`;

// font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
const TaxIcon = styled.div`
  padding-right: 8px;
  vertical-align: middle;
  display: table-cell;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-right: 12px;
  }
`;

class TaxonomySidebarItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  getTaxTitle = (id) =>
    this.context.intl.formatMessage(appMessages.entities.taxonomies[id].plural);

  render() {
    const { taxonomy, onTaxonomyClick } = this.props;
    return (
      <Styled
        onClick={(evt) => {
          onTaxonomyClick(evt);
          taxonomy.onLink(taxonomy.active);
        }}
        active={taxonomy.active}
        paletteId={parseInt(taxonomy.id, 10)}
        onMouseOver={() => taxonomy.onMouseOver && taxonomy.onMouseOver()}
        onFocus={() => taxonomy.onMouseOver && taxonomy.onMouseOver()}
        onMouseOut={() => taxonomy.onMouseOver && taxonomy.onMouseOver(false)}
        onBlur={() => taxonomy.onMouseOver && taxonomy.onMouseOver(false)}
      >
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
  onTaxonomyClick: PropTypes.func,
};

TaxonomySidebarItem.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TaxonomySidebarItem;
