import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Icon from 'components/Icon';

import FieldFactory from 'components/fields/FieldFactory';
import FieldGroupWrapper from 'components/fields/FieldGroupWrapper';
import FieldGroupLabel from 'components/fields/FieldGroupLabel';
import GroupIcon from 'components/fields/GroupIcon';
import Label from 'components/fields/Label';

class FieldGroup extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { group, seemless } = this.props;

    return (
      <FieldGroupWrapper type={group.type} seemless={seemless}>
        { group.label &&
          <FieldGroupLabel>
            { group.icon &&
              <GroupIcon>
                <Icon name={group.icon} />
              </GroupIcon>
            }
            <Label>
              <FormattedMessage {...group.label} />
            </Label>
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
  seemless: PropTypes.bool,
  aside: PropTypes.bool,
};

export default FieldGroup;
