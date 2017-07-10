import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Clear from 'components/styled/Clear';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled(Link)`
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

export default class EntityListNestedReportItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    report: PropTypes.object.isRequired,
    entityLinkTo: PropTypes.string,
  }

  render() {
    const { report, entityLinkTo } = this.props;

    return (
      <Styled to={`${entityLinkTo}${report.get('id')}`}>
        <Top>
          {report.getIn(['attributes', 'updated_at']) &&
            <Reference>
              {
                report.getIn(['attributes', 'updated_at'])
              }
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
        <Title to={`${entityLinkTo}${report.get('id')}`}>
          {
            report.getIn(['attributes', 'title'])
          }
        </Title>
      </Styled>
    );
  }
}
