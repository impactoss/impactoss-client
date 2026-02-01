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
        return (
          <div key={option.id}>
            <div>
              <StyledButton
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
              <div>
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
