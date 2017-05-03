import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import EntityListChildItems from 'components/EntityListChildItems';
import EntityListItemMain from './EntityListItemMain';
import EntityListItemSelect from './EntityListItemSelect';

import Component from 'components/basic/Component'

const Item = styled(Component)`
  padding: 1px 0;
  display: table;
  width:100%;
`;

export default class EntityListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    select: PropTypes.bool,
    checked: PropTypes.bool,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    expand: null,
  }

  render() {
    const {
      entity,
      select,
      checked,
      onSelect,
    } = this.props;

    return (
      <Item>
        {select &&
          <EntityListItemSelect checked={checked} onSelect={onSelect} />
        }
        <EntityListItemMain entity={entity}/>
        {entity.expandables &&
          entity.expandables.map((expandable) =>
            <EntityListItemExpandable
              type={expandable.type}
              count={expandable.count}
              info={expandable.info}
            />
          )
        }
      </Item>
    );
  }
}
