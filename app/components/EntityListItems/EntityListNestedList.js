import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import EntityListNestedItem from 'components/EntityListItem/EntityListNestedItem';
import EntityListNestedReportList from './EntityListNestedReportList';

const Styled = styled.span`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`;
const ItemWrapper = styled.div`
  border-top: ${(props) => props.separated ? '1px solid' : 'none'};
  border-top-color: ${(props) => props.separated ? palette('greyscaleDark', 4) : 'transparent'}
  padding: ${(props) => props.separated ? '0.5em 0 3em' : '0 0 1em'};
  border-bottom: 1px solid transparent;
`;
export class EntityListNestedList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  mapToEntityListItem = (entity, props) => {
    const {
      entityLinkTo,
      expandNo,
      isExpandable,
      expandableColumns,
      onExpand,
    } = props;
    return {
      id: entity.id,
      title: entity.attributes.name || entity.attributes.title,
      reference: entity.attributes.number || entity.id,
      linkTo: `${entityLinkTo}${entity.id}`,
      status: entity.attributes.draft ? 'draft' : null,
      expandables: isExpandable && !expandNo
        ? expandableColumns.map((column) => ({
          type: column.type,
          label: column.label,
          count: column.getCount && column.getCount(entity),
          info: column.getInfo && column.getInfo(entity),
          icon: column.icon,
          onClick: () => onExpand(),
        }))
        : [],
    };
  };

  render() {
    const {
      entities,
      expandNo,
      isExpandable,
      expandableColumns,
      entityIcon,
    } = this.props;

    return (
      <Styled>
        {
          entities.map((entity, i) =>
            <ItemWrapper key={i} separated={expandNo && i > 0}>
              <EntityListNestedItem
                entity={this.mapToEntityListItem(entity, this.props)}
                entityIcon={entityIcon}
                expandNo={expandNo}
              />
              {isExpandable && expandNo > 0 && expandableColumns.length > 0 &&
                <EntityListNestedReportList
                  reports={expandableColumns[0].getReports(entity)}
                  dates={expandableColumns[0].getDates(entity)}
                  entityLinkTo={expandableColumns[0].entityLinkTo}
                />
              }
            </ItemWrapper>
          )
        }
      </Styled>
    );
  }
}

EntityListNestedList.propTypes = {
  entities: PropTypes.array.isRequired,
  entityLinkTo: PropTypes.string,
  expandNo: PropTypes.number,
  isExpandable: PropTypes.bool,
  expandableColumns: PropTypes.array,
  onExpand: PropTypes.func,
  entityIcon: PropTypes.string,
};

export default EntityListNestedList;
