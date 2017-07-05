import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { isEqual } from 'lodash/lang';

import EntityListItems from 'components/EntityListItems';

import messages from './messages';

const ListEntitiesMain = styled.div`
  padding-top: 0.5em;
`;
const ListEntitiesEmpty = styled.div``;
const ListEntitiesGroup = styled.div``;
const ListEntitiesGroupHeader = styled.h3`
  margin-top: 30px;
`;
const ListEntitiesSubGroup = styled.div``;
const ListEntitiesSubGroupHeader = styled.h5`
  margin-top: 12px;
  font-weight: normal;
  margin-bottom: 20px;
`;

export class EntityListGroups extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  shouldComponentUpdate(nextProps) {
    // console.log('entitiesGrouped', isEqual(this.props.entitiesGrouped, nextProps.entitiesGrouped))
    // console.log('entityIdsSelected', this.props.entityIdsSelected === nextProps.entityIdsSelected)
    // console.log('locationQuery', isEqual(this.props.locationQuery, nextProps.locationQuery), nextProps.locationQuery)
    return !isEqual(this.props.entitiesGrouped, nextProps.entitiesGrouped)
    || !isEqual(this.props.locationQuery, nextProps.locationQuery)
    || this.props.entityIdsSelected !== nextProps.entityIdsSelected;
  }
  render() {
    const {
      entitiesGrouped,
      filters,
      locationQuery,
      header,
      entityLinkTo,
      isManager,
      onTagClick,
      onEntitySelect,
      expandNo,
      isExpandable,
      expandableColumns,
      handleExpandLink,
    } = this.props;
    const taxonomies = this.props.taxonomies && this.props.taxonomies.toJS();
    const entityIdsSelected = this.props.entityIdsSelected && this.props.entityIdsSelected.toJS();

    const locationGroup = locationQuery.group;
    const locationSubGroup = locationQuery.subgroup;

    return (
      <ListEntitiesMain>
        { entitiesGrouped.length === 0 && locationQuery &&
          <ListEntitiesEmpty>
            <FormattedMessage {...messages.listEmptyAfterQuery} />
          </ListEntitiesEmpty>
        }
        { entitiesGrouped.length === 0 && !locationQuery &&
          <ListEntitiesEmpty>
            <FormattedMessage {...messages.listEmpty} />
          </ListEntitiesEmpty>
        }
        { entitiesGrouped.length > 0 &&
          <div>
            {
              entitiesGrouped.map((entityGroup, i) => (
                <ListEntitiesGroup key={i}>
                  { locationGroup && entityGroup.label &&
                    <ListEntitiesGroupHeader>
                      {entityGroup.label}
                    </ListEntitiesGroupHeader>
                  }
                  {
                    entityGroup.entitiesGrouped &&
                    entityGroup.entitiesGrouped.map((entitySubGroup, j) => (
                      <ListEntitiesSubGroup key={j}>
                        { locationSubGroup && entitySubGroup.label &&
                          <ListEntitiesSubGroupHeader>
                            {entitySubGroup.label}
                          </ListEntitiesSubGroupHeader>
                        }
                        <EntityListItems
                          scrollContainer={this.props.scrollContainer}
                          taxonomies={taxonomies}
                          associations={filters}
                          entities={entitySubGroup.entities}
                          entityIdsSelected={entityIdsSelected}
                          entityIcon={header.icon}
                          entityLinkTo={entityLinkTo}
                          isSelect={isManager}
                          onTagClick={onTagClick}
                          onEntitySelect={onEntitySelect}
                          expandNo={expandNo}
                          isExpandable={isExpandable}
                          expandableColumns={expandableColumns}
                          onExpand={handleExpandLink}
                        />
                      </ListEntitiesSubGroup>
                    ))
                  }
                  { entityGroup.entities && !entityGroup.entitiesGrouped &&
                    <EntityListItems
                      scrollContainer={this.props.scrollContainer}
                      taxonomies={taxonomies}
                      associations={filters}
                      entities={entityGroup.entities}
                      entityIdsSelected={entityIdsSelected}
                      entityIcon={header.icon}
                      entityLinkTo={entityLinkTo}
                      isSelect={isManager}
                      onTagClick={onTagClick}
                      onEntitySelect={onEntitySelect}
                      expandNo={expandNo}
                      isExpandable={isExpandable}
                      expandableColumns={expandableColumns}
                      onExpand={handleExpandLink}
                    />
                  }
                </ListEntitiesGroup>
              ))
            }
          </div>
        }
      </ListEntitiesMain>
    );
  }
}

EntityListGroups.propTypes = {
  entitiesGrouped: PropTypes.array.isRequired,
  entityIdsSelected: PropTypes.object.isRequired,
  expandableColumns: PropTypes.array,
  taxonomies: PropTypes.object,
  filters: PropTypes.object,
  header: PropTypes.object,
  locationQuery: PropTypes.object,
  entityLinkTo: PropTypes.string,
  isManager: PropTypes.bool,
  expandNo: PropTypes.number,
  isExpandable: PropTypes.bool,
  onEntitySelect: PropTypes.func.isRequired,
  onTagClick: PropTypes.func.isRequired,
  handleExpandLink: PropTypes.func.isRequired,
  scrollContainer: PropTypes.object,
};

export default EntityListGroups;
