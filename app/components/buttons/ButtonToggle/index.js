import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ButtonDefaultWithIcon from 'components/buttons/ButtonDefaultWithIcon';

const Styled = styled.div`
  position: relative;
  height: 50px;
  max-width: 230px;
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

class ButtonToggle extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { options, activePanel, onSelect } = this.props;
    if (options.length === 2) {
      const optionInactive = options.find((option) => option.panel !== activePanel);
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
                  <ButtonDefaultWithIcon
                    icon={option.icon}
                    iconRight={i !== 0}
                    title={option.label}
                    onClick={(evt) => {
                      evt.stopPropagation();
                      onSelect(optionInactive.panel);
                    }}
                    fullWidth
                    strong
                    outline
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
                <ButtonDefaultWithIcon
                  icon={option.icon}
                  iconRight={i !== 0}
                  title={option.label}
                  fullWidth
                  onClick={() => onSelect(option.panel)}
                  align={i === 0 ? 'left' : 'right'}
                  inactive
                  border={{ palette: 'light', pIndex: 2 }}
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
