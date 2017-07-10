import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';
import EntityListNestedReportItem from './EntityListNestedItem/EntityListNestedReportItem';
import EntityListNestedReportDateItem from './EntityListNestedItem/EntityListNestedReportDateItem';

const ChildItems = styled.span`
  display: inline-block;
  width: 50%;
  vertical-align: top;
`;

export class EntityListNestedReportList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { entity, entityLinkTo } = this.props;
    return (
      <ChildItems>
        { entity.get('dates') &&
          <EntityListNestedReportDateItem
            dates={entity.get('dates')}
          />
        }
        {
          entity.get('reports').map((report, i) =>
            <EntityListNestedReportItem
              key={i}
              report={report}
              entityLinkTo={entityLinkTo}
            />
          )
        }
      </ChildItems>
    );
  }
}

EntityListNestedReportList.propTypes = {
  entity: PropTypes.instanceOf(Map),
  entityLinkTo: PropTypes.string,
};

export default EntityListNestedReportList;
