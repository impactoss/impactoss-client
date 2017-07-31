import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { find } from 'lodash/collection';

import asList from 'utils/as-list';

import Component from 'components/styled/Component';

import EntityListItemMain from '../../EntityListItem/EntityListItemMain';
import EntityListItemExpandable from '../../EntityListItem/EntityListItemExpandable';

const Styled = styled.span`
  display: inline-block;
  width: ${(props) => props.expanded ? 50 : 100}%;
  vertical-align: top;
`;

const Item = styled(Component)`
  display: table;
  width:100%;
  background-color: ${palette('primary', 4)};
`;
const MainWrapper = styled(Component)`
  display: table-cell;
  width: ${(props) => props.expandable ? 66 : 100}%;
  border-right: 1px solid ${(props) => props.expandable ? palette('light', 0) : 'transparent'};
`;
export default class EntityListNestedItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    expandNo: PropTypes.number,
    nestLevel: PropTypes.number,
    config: PropTypes.object,
    onEntityClick: PropTypes.func,
    onExpand: PropTypes.func,
  }

  render() {
    const {
      entity,
      expandNo,
      onExpand,
      onEntityClick,
      config,
      nestLevel,
    } = this.props;

    return (
      <Styled expanded={expandNo > nestLevel}>
        <Item>
          <MainWrapper expandable={entity.get('expandable')}>
            <EntityListItemMain
              entity={entity}
              config={config}
              onEntityClick={onEntityClick}
              nestLevel={nestLevel}
            />
          </MainWrapper>
          {
            entity.get('expandable') &&
            asList(entity.get('expandable')).map((attribute, i, list) =>
              <EntityListItemExpandable
                key={i}
                column={find(config.expandableColumns, (col) => col.type === attribute)}
                count={entity.get(attribute) ? entity.get(attribute).size : 0}
                dates={attribute === 'reports' ? entity.get('dates').toJS() : null}
                onClick={() => {
                  const nestLevelCount = nestLevel + i;
                  onExpand(expandNo > nestLevelCount ? nestLevelCount : nestLevelCount + 1);
                }}
                width={(1 - 0.66) / list.size}
              />
            )
          }
        </Item>
      </Styled>
    );
  }
}
