import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import EntityListChildItems from 'components/EntityListChildItems';

const ListItem = styled.div`
`;

const ListItemTable = styled.table`
  width: 100%;
`;
const ColSelect = styled.td`
  width: 30px;
  background: #fff;
`;
const ColMain = styled.td`
  vertical-align: top;
`;
const ColChildren = styled.td`
  width: 450px;
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
`;
const TitleLink = styled(Link)`
  font-weight: bold;
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

export default class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    children: PropTypes.object,
    // side: PropTypes.object,
    select: PropTypes.bool,
    checked: PropTypes.bool,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    // children: null,
    // side: null,
    checked: false,
  }

  renderListItem = () => {
    const { entity } = this.props;

    return (
      <ListItem>
        <ListItemTable><tbody><tr>
          <ColMain>
            <Main>
              <table><tbody><tr>
                {this.props.select &&
                  <ColSelect>
                    <input
                      type="checkbox"
                      checked={this.props.checked}
                      onChange={(evt) => this.props.onSelect(evt.target.checked)}
                    />
                  </ColSelect>
                }
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
          { this.props.entity.children &&
            <ColChildren>
              <EntityListChildItems
                entities={this.props.entity.children.entities}
                entitiesSelected={[]}
                showDate={this.props.entity.children.showDate}
                isSelect={false}
                taxonomies={null}
                entityLinkTo={this.props.entity.children.entityLinkTo}
                onEntitySelect={this.props.entity.children.onEntitySelect}
                filters={null}
              />
            </ColChildren>
          }
        </tr></tbody></ListItemTable>
      </ListItem>
    );
  }

  render() {
    // console.log('Item:render', this.props.entity, this.props.entity.children)

    return (
      <div>
        {this.renderListItem()}
      </div>
    );
  }
}
