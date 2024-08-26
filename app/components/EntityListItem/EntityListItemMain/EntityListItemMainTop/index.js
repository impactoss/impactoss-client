import React from 'react';
import PropTypes from 'prop-types';

import Component from 'components/styled/Component';

import ItemStatus from 'components/ItemStatus';
import ItemRole from 'components/ItemRole';
import ItemProgress from 'components/ItemProgress';
import ItemSupport from 'components/ItemSupport';

import EntityListItemMainTopReference from './EntityListItemMainTopReference';
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
        {
          entity.progressCategory
          && <ItemProgress status={entity.progressCategory} />
        }
        {
          entity.support
          && <ItemSupport supportLevel={entity.support} />
        }
        { entity.role
          && <ItemRole role={entity.role} />
        }
      </Component>
    );
  }
}
