import React from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopStatus from './EntityListItemMainTopStatus';
import EntityListItemMainTopIcon from './EntityListItemMainTopIcon';

export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
    onEntityClick: PropTypes.func,
    path: PropTypes.string,
  };

  render() {
    const { entity, onEntityClick, path } = this.props;

    return (
      <Component>
        <EntityListItemMainTopReference onClick={onEntityClick} href={path}>
          {entity.reference}
        </EntityListItemMainTopReference>
        { entity.entityIcon &&
          <EntityListItemMainTopIcon>
            <Icon name={entity.entityIcon} text iconRight />
          </EntityListItemMainTopIcon>
        }
        <EntityListItemMainTopStatus>{entity.status}</EntityListItemMainTopStatus>
      </Component>
    );
  }
}
