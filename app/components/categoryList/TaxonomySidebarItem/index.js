import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';
import Button from 'components/buttons/Button';

import appMessages from 'containers/App/messages';

// TODO compare EntityListSidebarOption
const Styled = styled(Button)`
  display: table;
  table-layout: fixed;
  width: 100%;
  padding:  ${({ small }) => small ? '0.15em 8px 0.15em 32px' : '0.3em 8px 0.3em 12px'};
  text-align: left;
  color:  ${(props) => props.active ? palette('asideCatNavItem', 1) : palette('asideCatNavItem', 0)};
  background-color: ${(props) => props.active ? palette('taxonomies', props.paletteId) : palette('asideCatNavItem', 2)};
  border-bottom: 1px solid ${palette('asideCatNavItem', 4)};
  &:hover {
    color: ${palette('asideCatNavItemHover', 1)};
    background-color: ${(props) => props.active ? palette('taxonomiesHover', props.paletteId) : palette('taxonomies', props.paletteId)};
    border-bottom-color: ${palette('asideCatNavItemHover', 4)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding:  ${({ small }) => small ? '0.15em 8px 0.15em 32px' : '0.3em 8px 0.3em 12px'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding:  ${({ small }) => small ? '0.25em 8px 0.25em 68px' : '0.5em 8px 0.5em 16px'};
  }
`;

const TaxTitle = styled.div`
  font-weight: bold;
  vertical-align: middle;
  display: table-cell;
`;

const TaxIcon = styled.div`
  padding-right: 8px;
  vertical-align: middle;
  display: table-cell;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding-right: 12px;
  }
`;

class TaxonomySidebarItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { taxonomy, nested, onTaxonomyClick } = this.props;
    return (
      <Styled
        small={nested}
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
          <Icon name={`taxonomy_${taxonomy.id}`} size={nested ? '28px' : null} />
        </TaxIcon>
        <TaxTitle>
          <FormattedMessage {...appMessages.entities.taxonomies[taxonomy.id].plural} />
        </TaxTitle>
      </Styled>
    );
  }
}

TaxonomySidebarItem.propTypes = {
  taxonomy: PropTypes.object,
  nested: PropTypes.bool,
  onTaxonomyClick: PropTypes.func,
};

TaxonomySidebarItem.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default TaxonomySidebarItem;
