import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';

import FieldFactory from 'components/fields/FieldFactory';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import GroupIcon from 'components/fields/GroupIcon';
import GroupLabel from 'components/fields/GroupLabel';

class FieldGroup extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { group, seamless } = this.props;

    return (
      <FieldGroupWrapper groupType={group.type} seamless={seamless}>
        { group.label &&
          <FieldGroupLabel basic={group.type === 'smartTaxonomy'}>
            <GroupLabel>
              <FormattedMessage {...group.label} />
            </GroupLabel>
            { group.icon &&
              <GroupIcon>
                <Icon name={group.icon} />
              </GroupIcon>
            }
          </FieldGroupLabel>
        }
        {
          group.fields.map((field, i) => field
            ? (<FieldFactory key={i} field={Object.assign({}, field, { aside: this.props.aside })} />)
            : null
          )
        }
      </FieldGroupWrapper>
    );
  }
}
FieldGroup.propTypes = {
  group: PropTypes.object.isRequired,
  seamless: PropTypes.bool,
  aside: PropTypes.bool,
};

export default FieldGroup;
