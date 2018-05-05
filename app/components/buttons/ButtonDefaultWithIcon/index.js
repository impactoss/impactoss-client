import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { map } from 'lodash/collection';

import ButtonDefault from 'components/buttons/ButtonDefault';
import Icon from 'components/Icon';

const Button = styled(ButtonDefault)`
  padding: 0.3em 1em 0.2em;
  width: ${(props) => props.fullWidth ? '100%' : 'auto'};
  text-align: ${(props) => props.align};
  text-transform: ${(props) => props.uppercase ? 'uppercase' : 'none'};
  font-weight: ${(props) => props.strong ? 'bold' : 'normal'};
  border: 1px solid;
  border-color: ${(props) => props.border ? palette(props.border.palette, props.border.pIndex) : 'transparent'};
  font-size: 0.85em;
  min-width: 80px;
  min-height: 2.2em;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    min-width: 90px;
    min-height: 3em;
    padding: 0.3em 1.5em 0.2em;
  }
`;

const Word = styled.span`
  display: ${(props) => props.hiddenSmall ? 'none' : 'inline'};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    display: ${(props) => {
      if (props.hiddenMedium) return 'none';
      if (props.visibleSmall) return 'none';
      return 'inline';
    }};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    display: ${(props) => {
      if (props.hiddenLarge) return 'none';
      if (props.visibleSmall) return 'none';
      if (props.visibleMedium) return 'none';
      return 'inline';
    }};
  }
  ${(props) => props.iconRight
    ? '&:after { content: " "; }'
    : '&:before { content: " "; }'
  }
`;

class ButtonDefaultWithIcon extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  renderTitle = (title, iconRight) => {
    if (typeof title === 'string') return <Word iconRight={iconRight}>{title}</Word>;
    if (Array.isArray(title)) {
      return (
        <span>
          {
            map(title, (word, i) => {
              if (typeof word === 'string') return (<Word iconRight={iconRight} key={i}>{word}</Word>);
              if (typeof word === 'object' && word.title) {
                return (
                  <Word
                    key={i}
                    hiddenSmall={word.hiddenSmall}
                    hiddenMedium={word.hiddenMedium}
                    hiddenLarge={word.hiddenLarge}
                    visibleSmall={word.visibleSmall}
                    visibleMedium={word.visibleMedium}
                    iconRight={iconRight}
                  >
                    {word.title}
                  </Word>
                );
              }
              return '';
            })
          }
        </span>
      );
    }
    return '';
  }
  render() {
    const { icon, title, onClick, iconRight, fullWidth, disabled, inactive, align, strong, border, outline } = this.props;
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
        outline={outline}
      >
        { iconRight && this.renderTitle(title, iconRight) }
        <Icon name={icon} text />
        { !iconRight && this.renderTitle(title) }
      </Button>
    );
  }
}
ButtonDefaultWithIcon.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  iconRight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  inactive: PropTypes.bool,
  strong: PropTypes.bool,
  outline: PropTypes.bool,
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
