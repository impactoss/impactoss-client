import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Component from 'components/basic/Component';

import EntityListItemMain from '../EntityListItemMain';
import EntityListItemExpandable from '../EntityListItemExpandable';

const Styled = styled.span`
  display: inline-block;
  width:${(props) => props.expandNo ? '50%' : '100%'};
  vertical-align: top;
`;

const Item = styled(Component)`
  display: table;
  width:100%;
  background-color: ${palette('primary', 4)};
`;
const MainWrapper = styled(Component)`
  display: table-cell;
  width: ${(props) => props.width * 100}%;
  border-right: 1px solid ${(props) => props.width < 1 ? palette('greyscaleLight', 0) : 'transparent'};
`;
export default class EntityListNestedItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    expandNo: PropTypes.number,
    entityIcon: PropTypes.string,
  }

  render() {
    const {
      entity,
      expandNo,
      entityIcon,
    } = this.props;

    const widthMain = entity.expandables ? 0.66 : 1;

    return (
      <Styled expandNo={expandNo}>
        <Item>
          <MainWrapper width={widthMain} >
            <EntityListItemMain
              entity={entity}
              entityIcon={entityIcon}
              nested
            />
          </MainWrapper>
          {entity.expandables &&
            entity.expandables.map((expandable, i, list) =>
              <EntityListItemExpandable
                key={i}
                label={expandable.label}
                type={expandable.type}
                count={expandable.count}
                info={expandable.info}
                onClick={expandable.onClick}
                entityIcon={expandable.icon}
                width={(1 - 0.66) / list.length}
              />
            )
          }
        </Item>
      </Styled>
    );
  }
}
