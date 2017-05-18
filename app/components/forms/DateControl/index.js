import React, { PropTypes } from 'react';
// import styled from 'styled-components';
// import { palette } from 'styled-theme';

import ControlInput from '../ControlInput';

export class DateControl extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { model, ...props } = this.props;
    return (
      <ControlInput
        model={model}
        {...props}
      />
    );
  }
}

DateControl.propTypes = {
  model: PropTypes.string.isRequired,
};
// DateControl.contextTypes = {
//   intl: PropTypes.object.isRequired,
// };

export default DateControl;
