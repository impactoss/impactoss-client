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


export default class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    children: PropTypes.object,
    select: PropTypes.bool,
    checked: PropTypes.bool,
    onSelect: PropTypes.func,
    expand: PropTypes.string,
  }

  static defaultProps = {
    checked: false,
    expand: null,
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

                </td>
              </tr></tbody></table>
            </Main>
          </ColMain>
          { this.props.expand && this.props.entity.children &&
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
                expand={this.props.expand}
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
