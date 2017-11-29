import React from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

import ItemStatus from 'components/ItemStatus';
import ItemRole from 'components/ItemRole';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopIcon from './EntityListItemMainTopIcon';

export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    const { entity } = this.props;

    return (
      <Component>
        <EntityListItemMainTopReference>
          {entity.reference}
        </EntityListItemMainTopReference>
        { entity.entityIcon &&
          <EntityListItemMainTopIcon>
            <Icon name={entity.entityIcon} text iconRight />
          </EntityListItemMainTopIcon>
        }
        { entity.draft &&
          <ItemStatus draft={entity.draft} />
        }
        { entity.role &&
          <ItemRole role={entity.role} />
        }
      </Component>
    );
  }
}
