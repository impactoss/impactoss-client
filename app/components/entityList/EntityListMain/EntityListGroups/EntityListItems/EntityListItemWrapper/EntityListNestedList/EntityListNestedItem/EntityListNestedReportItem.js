import React from 'react';
import PropTypes from 'prop-types';
import Clear from 'components/styled/Clear';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled.a`
  padding: 5px 10px;
  position: relative;
  background-color: ${palette('primary', 4)};
  margin-top: 1px;
  display: block;
  color: ${palette('dark', 4)};
  &:hover {
    color: ${palette('dark', 2)};
  }
`;
const Top = styled.div`
`;
const Status = styled.div`
  float: right;
  font-weight: bold;
  font-size: 0.8em;
  text-transform: uppercase;
`;
const Reference = styled.div`
  float:left;
  font-weight: bold;
  text-decoration: none;
  font-size: 0.9em;
`;
const Title = styled.div`
  font-size: 0.8em;
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
          {report.getIn(['attributes', 'updated_at']) &&
            <Reference>
              { this.context.intl && this.context.intl.formatDate(new Date(report.getIn(['attributes', 'updated_at'])))}
            </Reference>
          }
          {report.getIn(['attributes', 'draft']) &&
            <Status>
              {
                report.getIn(['attributes', 'draft'])
              }
            </Status>
          }
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
