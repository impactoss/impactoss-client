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
  color:  ${(props) => props.active ? palette('taxonomiesTextColor', props.paletteId) : palette('asideCatNavItem', 0)};
  background-color: ${(props) => props.active ? palette('taxonomies', props.paletteId) : palette('asideCatNavItem', 2)};
  border-bottom: 1px solid ${palette('asideCatNavItem', 4)};
  &:hover, &:focus-visible {
    color: ${(props) => palette('taxonomiesTextColor', props.paletteId)};
    background-color: ${(props) => props.active ? palette('taxonomiesHover', props.paletteId) : palette('taxonomies', props.paletteId)};
    border-bottom-color: ${palette('asideCatNavItemHover', 4)};
    outline: none;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding:  ${({ small }) => small ? '0.15em 8px 0.15em 32px' : '0.3em 8px 0.3em 12px'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding:  ${({ small }) => small ? '0.25em 8px 0.25em 68px' : '0.5em 8px 0.5em 16px'};
  }
`;

const TaxTitle = styled.div`
  font-weight: ${({ nested }) => nested ? 600 : 700};
  font-size: ${({ nested }) => nested ? 0.9 : 1}em;
  padding-left: ${({ nested }) => nested ? 20 : 0}px;
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
    const {
      taxonomy,
      nested,
      onTaxonomyClick,
      onTaxonomyOver,
    } = this.props;
    return (
      <Styled
        small={false}
        onClick={(evt) => {
          onTaxonomyClick(evt);
          taxonomy.onLink(taxonomy.active);
        }}
        active={taxonomy.active}
        paletteId={parseInt(taxonomy.id, 10)}
        onMouseOver={() => onTaxonomyOver && onTaxonomyOver(taxonomy.id)}
        onFocus={() => onTaxonomyOver && onTaxonomyOver(taxonomy.id)}
        onMouseOut={() => onTaxonomyOver && onTaxonomyOver(null)}
        onBlur={() => onTaxonomyOver && onTaxonomyOver(null)}
      >
        <TaxIcon>
          <Icon
            name={`taxonomy_${taxonomy.id}`}
            size="40px"
          />
        </TaxIcon>
        <TaxTitle nested={nested}>
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
  onTaxonomyOver: PropTypes.func,
};

export default TaxonomySidebarItem;
