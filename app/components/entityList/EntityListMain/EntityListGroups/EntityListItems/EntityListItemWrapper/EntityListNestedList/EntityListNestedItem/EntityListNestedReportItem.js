import React from 'react';
import PropTypes from 'prop-types';
import Clear from 'components/styled/Clear';
import EntityListItemStatus from 'components/entityList/EntityListMain/EntityListGroups/EntityListItems/EntityListItemStatus';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.a`
  padding: 10px 15px;
  position: relative;
  background-color: ${palette('primary', 4)};
  margin-bottom: 1px;
  display: block;
  color: ${palette('dark', 4)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;
const Top = styled.div`
`;

const Reference = styled.div`
  float:left;
  text-decoration: none;
  font-weight: 500;
`;
const Title = styled.div`
  text-decoration: none;
`;

class EntityListNestedReportItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { report, onEntityClick } = this.props;

    return (
      <Styled
        onClick={(evt) => {
          evt.preventDefault();
          onEntityClick(report.get('id'), 'reports');
        }}
        href={`/reports/${report.get('id')}`}
      >
        <Top>
          {report.get('date') &&
            <Reference>
              { this.context.intl && this.context.intl.formatDate(new Date(report.getIn(['date', 'attributes', 'due_date'])))}
            </Reference>
          }
          <EntityListItemStatus draft={report.getIn(['attributes', 'draft'])} />
        </Top>
        <Clear />
        <Title>
          {
            report.getIn(['attributes', 'title'])
          }
        </Title>
      </Styled>
    );
  }
}

EntityListNestedReportItem.propTypes = {
  report: PropTypes.object.isRequired,
  onEntityClick: PropTypes.func,
};


EntityListNestedReportItem.contextTypes = {
  intl: PropTypes.object,
};

export default EntityListNestedReportItem;
