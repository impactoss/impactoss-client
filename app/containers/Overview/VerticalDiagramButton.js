/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { palette } from 'styled-theme';

import styled from 'styled-components';

// components
import Button from 'components/buttons/Button';
import Icon from 'components/Icon';

// relative
import appMessages from 'containers/App/messages';
import messages from './messages';

const DiagramButton = styled((p) => <Button {...p} />)`
  background-color: ${(props) => palette(props.paletteDefault, 0)};
  color: white;
  padding: ${({ draft }) => draft ? '0.4em 0.5em 0.75em' : '0.6em 0.5em'};
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
  font-size: 0.7em;
  border-radius: 15px;
  max-width: ${({ multiple }) => multiple ? '70px' : 'none'};
  min-width: 0;
  &:hover {
    background-color: ${(props) => palette(props.paletteHover, 0)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1em;
    padding: ${({ draft }) => draft ? '0.4em 0.5em 0.4em' : '0.6em 0.5em'};
    max-width: ${({ multiple }) => multiple ? '140px' : 'none'};
    min-width: ${({ multiple }) => multiple ? '120px' : 'none'};
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 1.1em;
    min-width: ${({ multiple }) => multiple ? 'none' : '180px'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-weight: bold;
    max-width: none;
    min-width: 200px;
    padding: ${({ draft }) => draft ? '0.6em 1em 0.2em' : '0.8em 1em'};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
    box-shadow: none;
    border: 1px solid ${palette('light', 3)};
    min-width: none;
    width: 130px;
    height: 90px;
  }
`;

const DiagramButtonIcon = styled.div`
  padding-bottom: 5px;
`;

const DraftEntities = styled.div`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: block;
    font-size: 0.8em;
    font-weight: normal;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

const VerticalDiagramButton = React.forwardRef((props, ref) => {
  const {
    path,
    query,
    paletteDefault,
    paletteHover,
    icon,
    type,
    count,
    draftCount,
    multiple,
    onPageLink,
    intl,
  } = props;
  return (
    <div ref={ref}>
      <DiagramButton
        onClick={() => onPageLink(path, query)}
        paletteDefault={paletteDefault}
        paletteHover={paletteHover}
        draft={draftCount > 0}
        multiple={multiple}
        title={intl.formatMessage(
          messages.buttons.title,
          { label: `${count || 0} ${intl.formatMessage(appMessages.entities[type][count !== 1 ? 'plural' : 'single'])}` },
        )}
      >
        <DiagramButtonIcon>
          <Icon
            name={icon}
            sizes={{
              mobile: '24px',
              small: '24px',
              medium: '24px',
              large: '24px',
            }}
          />
        </DiagramButtonIcon>
        <div>
          {`${count || 0} ${intl.formatMessage(appMessages.entities[type][count !== 1 ? 'plural' : 'single'])}`}
        </div>
        {draftCount > 0 && (
          <DraftEntities>
            <FormattedMessage {...messages.buttons.draft} values={{ count: draftCount }} />
          </DraftEntities>
        )}
      </DiagramButton>
    </div>
  );
});

VerticalDiagramButton.propTypes = {
  path: PropTypes.string,
  query: PropTypes.object,
  paletteDefault: PropTypes.string,
  paletteHover: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string,
  count: PropTypes.number,
  draftCount: PropTypes.number,
  multiple: PropTypes.bool,
  onPageLink: PropTypes.func,
  intl: PropTypes.object.isRequired,
};

export default VerticalDiagramButton;
