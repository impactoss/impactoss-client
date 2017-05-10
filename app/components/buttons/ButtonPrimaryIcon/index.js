import React, { PropTypes } from 'react';
import styled from 'styled-components';
// import { palette } from 'styled-theme';

import ButtonPrimary from 'components/buttons/ButtonPrimary';
import Icon from 'components/Icon';

const Button = styled(ButtonPrimary)`
  padding: 0.5em 1em 0.5em 1.25em;
`;

class ButtonPrimaryIcon extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { icon, title, onClick } = this.props;
    return (
      <Button onClick={onClick}>
        {title}
        <Icon name={icon} text textRight />
      </Button>
    );
  }
}
ButtonPrimaryIcon.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButtonPrimaryIcon;
