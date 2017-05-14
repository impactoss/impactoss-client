import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Clear from 'components/basic/Clear';

import styled from 'styled-components';
import { palette } from 'styled-theme';

const Styled = styled(Link)`
  padding: 5px 10px;
  position: relative;
  background-color: ${palette('primary', 4)};
  margin-top: 1px;
  display: block;
  color: ${palette('greyscaleDark', 4)};
  &:hover {
    color: ${palette('greyscaleDark', 2)};
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
  }


  render() {
    const { report } = this.props;

    return (
      <Styled to={report.linkTo}>
        <Top>
          {report.reference &&
            <Reference>{report.reference}</Reference>
          }
          {report.status &&
            <Status>{report.status}</Status>
          }
        </Top>
        <Clear />
        <Title to={report.linkTo}>{report.title}</Title>
      </Styled>
    );
  }
}
