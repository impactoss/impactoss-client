import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const ListItem = styled.div`
`;

const ListItemTable = styled.table`
  width: 100%;
`;
const ColMain = styled.td`
  vertical-align: top;
`;
const Main = styled.div`
  position: relative;
  background: #fff;
`;
const ReferenceLink = styled(Link)`
  color: #888;
  font-weight: bold;
  text-decoration: none;
  display: block;
  font-size:0.9em;
`;
const TitleLink = styled(Link)`
  font-size:0.9em;
  text-decoration: none;
  display: block;
  padding: 5px 0;
`;
const Status = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-weight: bold;
  font-size: 0.8em;
  color: #666;
  text-transform: uppercase;
`;

export default class EntityListChildReportItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    report: PropTypes.object.isRequired,
  }

  renderListItem = () => {
    const { report } = this.props;

    return (
      <ListItem>
        <ListItemTable><tbody><tr>
          <ColMain>
            <Main>
              {report.reference &&
                <ReferenceLink to={report.linkTo}>{report.reference}</ReferenceLink>
              }
              {report.status &&
                <Status>{report.status}</Status>
              }
              <TitleLink to={report.linkTo}>{report.title}</TitleLink>
            </Main>
          </ColMain>
        </tr></tbody></ListItemTable>
      </ListItem>
    );
  }

  render() {
    // console.log('Item:render', this.props.entity)

    return (
      <div>
        {this.renderListItem()}
      </div>
    );
  }
}
