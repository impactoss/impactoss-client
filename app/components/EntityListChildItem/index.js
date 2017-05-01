import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import EntityListChildReportItems from 'components/EntityListChildReportItems';


const ListItem = styled.div`
`;

const ListItemTable = styled.table`
  width: 100%;
`;
const ColMain = styled.td`
  vertical-align: top;
`;
const ColChildren = styled.td`
  width: 200px;
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
const Updated = styled.span`
  font-size: 0.8em;
  color: #999;
  padding-left: 10px;
`;
const Tag = styled.button`
  display: inline-block;
  background: #ccc;
  padding: 1px 6px;
  margin: 0 3px;
  border-radius: 3px;
  font-size: 0.8em;
  &:hover {
    opacity: 0.8;
  }
`;
const Button = styled(Tag)`
  cursor: pointer;
`;
const Count = styled.span`
display: inline-block;
background: #eee;
color: #333;
padding: 1px 6px;
margin: 0 3px;
border-radius: 999px;
font-size: 0.8em;
`;

export default class EntityListChildItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
  }

  renderListItem = () => {
    const { entity } = this.props;

    return (
      <ListItem>
        <ListItemTable><tbody><tr>
          <ColMain>
            <Main>
              <table><tbody><tr>
                <td>
                  {entity.reference &&
                    <ReferenceLink to={entity.linkTo}>{entity.reference}</ReferenceLink>
                  }
                  {entity.status &&
                    <Status>{entity.status}</Status>
                  }
                  <TitleLink to={entity.linkTo}>{entity.title}</TitleLink>
                  <div>
                    { entity.tags && entity.tags.length > 0 &&
                      <span>
                        Categories:
                        {
                          entity.tags.map((tag, i) => {
                            if (tag.onClick) {
                              return (<Button key={i} onClick={tag.onClick}>{tag.label}</Button>);
                            }
                            return (<Tag key={i}>{tag.label}</Tag>);
                          })
                        }
                      </span>
                    }
                    { entity.connectedCounts && entity.connectedCounts.length > 0 &&
                      <span>
                        {
                          entity.connectedCounts.map((count, i) => (
                            <span key={i}>
                              {count.option.label}
                              <Count>{count.count}</Count>
                            </span>
                          ))
                        }
                      </span>
                    }
                    { entity.updated &&
                      <Updated>
                        {entity.updated}
                      </Updated>
                    }
                  </div>
                </td>
              </tr></tbody></table>
            </Main>
          </ColMain>
          <ColChildren>
            { this.props.entity.reportChildren &&
              <EntityListChildReportItems
                reports={this.props.entity.reportChildren.reports}
                dates={this.props.entity.reportChildren.dates}
                entityLinkTo={this.props.entity.reportChildren.entityLinkTo}
              />
            }
          </ColChildren>
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
