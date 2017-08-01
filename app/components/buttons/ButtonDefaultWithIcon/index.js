import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonDefault from 'components/buttons/ButtonDefault';
import Icon from 'components/Icon';

const Button = styled(ButtonDefault)`
  padding: 0.25em 1.25em;
  width: ${(props) => props.fullWidth ? '100%' : 'auto'};
  min-height: 3em;
  text-align: ${(props) => props.align};
  text-transform: ${(props) => props.uppercase ? 'uppercase' : 'none'};
  font-weight: ${(props) => props.strong ? 'bold' : 'normal'};
  font-size: 0.85em;
  border: ${(props) => props.border ? '1px solid' : 0};
  border-color: ${(props) => props.border ? palette(props.border.palette, props.border.pIndex) : 'transparent'};
`;

const Title = styled.span`
  padding-right: 0;
  padding-left: 0;
  position: relative;
  top: 0.05em;
`;

class ButtonDefaultWithIcon extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { icon, title, onClick, iconRight, fullWidth, disabled, inactive, align, strong, border } = this.props;
    return (
      <Button
        onClick={onClick}
        fullWidth={fullWidth}
        disabled={disabled}
        inactive={inactive}
        align={align}
        strong={strong}
        title={title}
        border={border}
      >
        { iconRight &&
          <Title iconRight>{title}</Title>
        }
        <Icon name={icon} text textRight={iconRight} textLeft={!iconRight} />
        { !iconRight &&
          <Title>{title}</Title>
        }
      </Button>
    );
  }
}
ButtonDefaultWithIcon.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  iconRight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  inactive: PropTypes.bool,
  strong: PropTypes.bool,
  align: PropTypes.string,
  border: PropTypes.object,
};

ButtonDefaultWithIcon.defaultProps = {
  iconRight: true,
  fullWidth: false,
  disabled: false,
  inactive: false,
  strong: false,
  border: null,
  align: 'center',
};

export default ButtonDefaultWithIcon;
