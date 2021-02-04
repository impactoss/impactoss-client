/*
 *
 * EntityListPrintKey
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Map, List } from 'immutable';
import { sortEntities } from 'utils/sort';

import ButtonTagCategory from 'components/buttons/ButtonTagCategory';

import appMessages from 'containers/App/messages';

import { makeCategoriesForTaxonomy } from './categoryFactory';

// import messages from './messages';

const Taxonomy = styled.div`
  width: 100%;
  padding: ${(props) => props.small ? '0.5em 8px 0.5em 36px' : '0.75em 8px 0.75em 16px'};
  text-align: left;
  color: ${(props) => props.active ? palette('asideListItem', 1) : palette('asideListItem', 0)};
  background-color: ${(props) => props.active ? palette('asideListItem', 3) : palette('asideListItem', 2)};
  border-bottom: 1px solid ${palette('asideListItem', 4)};
  &:last-child {
    border-bottom: 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.small ? '0.5em 8px 0.5em 36px' : '0.75em 8px 0.75em 16px'};
  }
`;
const Label = styled.div`
  font-weight: bold;
`;


const Styled = styled.div``;

export class EntityListPrintKey extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      config,
      entities,
      taxonomies,
      locationQuery,
    } = this.props;
    // only show taxonomy & associated categories if some list items have such category
    return (
      <Styled>
        {config.taxonomies && taxonomies && sortEntities(taxonomies, 'asc', 'priority').map(
          (tax) => {
            const categories = makeCategoriesForTaxonomy(
              tax,
              config,
              entities,
              taxonomies,
              locationQuery,
            );
            // const nested = tax.getIn(['attributes', 'parent_id']);
            if (categories && categories.items && categories.items.length > 0) {
              return (
                <Taxonomy key={tax.get('id')}>
                  <Label>
                    <FormattedMessage {...appMessages.entities.taxonomies[tax.get('id')].plural} />
                  </Label>
                  <div>
                    {categories.items.map((cat) => (
                      <div key={cat.id}>
                        <ButtonTagCategory
                          as="span"
                          taxId={parseInt(tax.get('id'), 10)}
                        >
                          {cat.short}
                        </ButtonTagCategory>
                        {cat.label}
                      </div>
                    ))}
                  </div>
                </Taxonomy>
              );
            }
            return null;
          }
        )}
      </Styled>
    );
  }
}
EntityListPrintKey.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  locationQuery: PropTypes.instanceOf(Map),
  config: PropTypes.object,
  // theme: PropTypes.object,
};

EntityListPrintKey.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default EntityListPrintKey;
