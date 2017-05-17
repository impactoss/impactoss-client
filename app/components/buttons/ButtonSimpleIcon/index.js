import React, { PropTypes } from 'react';
import styled from 'styled-components';
// import { palette } from 'styled-theme';

import ButtonPrimary from 'components/buttons/ButtonPrimary';
import Icon from 'components/Icon';

const Button = styled(ButtonPrimary)`
  padding: 0.25em 1em 0.25em 1.25em;
  width: ${(props) => props.fullWidth ? '100%' : 'auto'};
  min-height: 3em;
  text-align: ${(props) => props.align};
  text-transform: ${(props) => props.strong ? 'uppercase' : 'none'};
  font-weight: ${(props) => props.strong ? 'bold' : 'normal'};
`;

class ButtonPrimaryIcon extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { icon, title, onClick, iconRight, fullWidth, disabled, inactive, align, strong } = this.props;
    return (
      <Button
        onClick={onClick}
        fullWidth={fullWidth}
        disabled={disabled}
        inactive={inactive}
        align={align}
        strong={strong}
        title={title}
      >
        { iconRight &&
          <span>{title}</span>
        }
        <Icon name={icon} text textRight={iconRight} textLeft={!iconRight} />
        { !iconRight &&
          <span>{title}</span>
        }
      </Button>
    );
  }
}
ButtonPrimaryIcon.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  iconRight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  inactive: PropTypes.bool,
  strong: PropTypes.bool,
  align: PropTypes.string,
};

ButtonPrimaryIcon.defaultProps = {
  iconRight: true,
  fullWidth: false,
  disabled: false,
  inactive: false,
  strong: false,
  align: 'center',
};

export default ButtonPrimaryIcon;
