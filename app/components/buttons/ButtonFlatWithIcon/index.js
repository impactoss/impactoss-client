import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonFlat from 'components/buttons/ButtonFlat';
import Icon from 'components/Icon';

const Button = styled(ButtonFlat)`
  width: ${(props) => props.fullWidth ? '100%' : 'auto'};
  text-align: ${(props) => props.align};
  text-transform: ${(props) => props.uppercase ? 'uppercase' : 'none'};
  font-weight: ${(props) => props.strong ? 'bold' : 'normal'};
  border: ${(props) => props.border ? '1px solid' : 0};
  border-color: ${(props) => props.border ? palette(props.border.palette, props.border.pIndex) : 'transparent'};
  min-height: 2.2em;
  padding: ${(props) => props.form ? '0.7em 0.5em' : '0.25em 1.25em'};
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: ${(props) => props.form ? '1em 1.2em' : '0.25em 1.25em'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-height: 3em;
  }
`;

// const Title = styled.span`
//   padding-right: 0;
//   padding-left: 0;
//   position: relative;
//   top: 0.05em;
// `;

class ButtonFlatWithIcon extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { iconRight, title, icon, ...props } = this.props;
    return (
      <Button
        title={title}
        {...props}
      >
        { iconRight && title }
        <Icon name={icon} text textRight={iconRight} textLeft={!iconRight} />
        { !iconRight && title }
      </Button>
    );
  }
}
ButtonFlatWithIcon.propTypes = {
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

ButtonFlatWithIcon.defaultProps = {
  iconRight: true,
  fullWidth: false,
  disabled: false,
  inactive: false,
  strong: false,
  border: null,
  align: 'center',
};

export default ButtonFlatWithIcon;
