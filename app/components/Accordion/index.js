import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'grommet';
import styled from 'styled-components';
import { without } from 'lodash/array';

import AccordionHeader from 'components/AccordionHeader';

const getActives = ({ activePanels, panelId, single }) => {
  const changeToOpen = activePanels.indexOf(panelId) === -1;
  if (single) {
    return changeToOpen ? [panelId] : [];
  }
  return changeToOpen ? [...activePanels, panelId] : without(activePanels, panelId);
};

const StyledButton = styled((p) => <Button plain {...p} />)`
  width: 100%;
  &:focus {
    box-shadow: none;
  }
  &:focus-visible {
    outline: 2px solid #00549B;
    outline-offset: 2px;
  }
  &:hover {
    opacity: 0.8;
  }
`;

export function Accordion({
  activePanels,
  onActive,
  single,
  options,
}) {
  return (
    <div>
      {options.filter((o) => !!o).map((option) => {
        const open = activePanels.indexOf(option.id) > -1;
        const panelId = `accordion-panel-${option.id}`;
        const buttonId = `accordion-btn-${option.id}`;

        return (
          <div key={option.id}>
            <div>
              <StyledButton
                id={buttonId}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                onClick={() => onActive(
                  getActives({ activePanels, panelId: option.id, single }),
                )}
              >
                <AccordionHeader
                  title={option.titleButton}
                  open={open}
                />
              </StyledButton>
            </div>
            {open && option.content && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
              >
                {option.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

Accordion.propTypes = {
  activePanels: PropTypes.array,
  onActive: PropTypes.func,
  single: PropTypes.bool,
  options: PropTypes.array,
};

export default Accordion;
