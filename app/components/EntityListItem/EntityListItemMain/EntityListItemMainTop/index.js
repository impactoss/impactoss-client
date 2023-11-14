import React from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';
import Icon from 'components/Icon';

import ItemStatus from 'components/ItemStatus';
import ItemRole from 'components/ItemRole';
import ItemProgress from 'components/ItemProgress';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
import EntityListItemMainTopIcon from './EntityListItemMainTopIcon';
import EntityListItemMainTargetDate from './EntityListItemMainTargetDate';
import EntityListItemMainUser from './EntityListItemMainUser';

export default class EntityListItemMainTop extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    const { entity } = this.props;

    return (
      <Component>
        { entity.draft
          && <ItemStatus draft={entity.draft} float="left" />
        }
        <EntityListItemMainTopReference>
          {entity.reference}
        </EntityListItemMainTopReference>
        { entity.targetDate
          && (
            <EntityListItemMainTargetDate
              targetDate={entity.targetDate}
            />
          )
        }
        { entity.assignedUser
          && (
            <EntityListItemMainUser
              user={entity.assignedUser}
            />
          )
        }
        { entity.entityIcon
          && (
            <EntityListItemMainTopIcon>
              <Icon name={entity.entityIcon} text />
            </EntityListItemMainTopIcon>
          )
        }
        {
          entity.progressCategory
          && <ItemProgress status={entity.progressCategory} />
        }
        { entity.role
          && <ItemRole role={entity.role} />
        }
      </Component>
    );
  }
}
