import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ButtonPrimaryIcon from 'components/buttons/ButtonPrimaryIcon';

const Styled = styled.div`
  border-radius: 999px;
  position: relative;
  display: block;
  background-color: ${palette('greyscaleLight', 1)}
  height: 46px;
`;

const ButtonActive = styled.span`
  min-width: 52%;
  position:absolute;
  left: ${(props) => props.left ? 0 : 'auto'};
  right: ${(props) => props.right ? 0 : 'auto'};
  top: 0;
  z-index: 2;
`;
const ButtonInactive = styled.span`
  width: 100%;
  position:absolute;
  left: ${(props) => props.left ? 0 : 'auto'};
  right: ${(props) => props.right ? 0 : 'auto'};
  top: 0;
  z-index: 1;
`;

class ButtonToggle extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { options, activePanel, onSelect } = this.props;
    if (options.length === 2) {
      return (
        <Styled>
          { options.map((option, i) => {
            if (option.panel === activePanel) {
              return (
                <ButtonActive
                  key={i}
                  left={i === 0}
                  right={i === 1}
                >
                  <ButtonPrimaryIcon
                    icon={option.icon}
                    iconRight={i !== 0}
                    title={option.label}
                    disabled
                    fullWidth
                    strong
                    align={i === 0 ? 'left' : 'right'}
                  />
                </ButtonActive>
              );
            }
            return (
              <ButtonInactive
                key={i}
                left={i === 0}
                right={i === 1}
              >
                <ButtonPrimaryIcon
                  icon={option.icon}
                  iconRight={i !== 0}
                  title={option.label}
                  fullWidth
                  onClick={() => onSelect(option.panel)}
                  align={i === 0 ? 'left' : 'right'}
                  inactive
                  strong
                />
              </ButtonInactive>
            );
          })}
        </Styled>
      );
    }
    return null;
  }
}
ButtonToggle.propTypes = {
  options: PropTypes.array,
  activePanel: PropTypes.string,
  onSelect: PropTypes.func,
};

export default ButtonToggle;
