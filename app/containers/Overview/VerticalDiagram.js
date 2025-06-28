/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { PathLine } from 'react-svg-pathline';
import { palette } from 'styled-theme';

import styled, { withTheme } from 'styled-components';

import { ROUTES } from 'containers/App/constants';

// components
import Button from 'components/buttons/Button';
import Icon from 'components/Icon';

import isNumber from 'utils/is-number';

// relative
import appMessages from 'containers/App/messages';
import messages from './messages';
import VerticalDiagramButton from './VerticalDiagramButton';
import VerticalDiagramSVG  from './VerticalDiagramSVG';

const Diagram = styled(
  React.forwardRef((p, ref) => <div ref={ref} {...p} />)
)`
  position: relative;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-bottom: 180px;
  }
`;

const DiagramSectionVertical = styled.div`
  display: block;
  position: relative;
  border-top: 1px dashed ${palette('light', 4)};
`;

const DiagramSectionVerticalCenter = styled.div`
  text-align: center;
  display: block;
  margin: 0 auto;
  position: relative;
`;

const DiagramButtonWrap = styled.div`
  position: relative;
  display: inline-block;
  padding: 20px 0;
  vertical-align: bottom;
  margin: ${({ multiple }) => multiple ? '30px 2px' : '30px 0'};
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin: ${({ multiple }) => multiple ? '30px 5px' : '30px 0'};
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  @media print {
    margin: 15px 5px;
    padding: 0;
  }
`;

const DiagramButton = styled((p) => <Button {...p} />)`
  background-color: ${(props) => palette(props.paletteDefault, 0)};
  color: white;
  padding: ${({ draft }) => draft ? '0.4em 0.5em 0.75em' : '0.6em 0.5em'};
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
  font-size: 0.7em;
  border-radius: 15px;
  max-width: ${({ multiple }) => multiple ? '70px' : 'none'};
  min-width: none;
  &:hover {
    background-color: ${(props) => palette(props.paletteHover, 0)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1em;
    padding: ${({ draft }) => draft ? '0.4em 0.5em 0.4em' : '0.6em 0.5em'};
    max-width: ${({ multiple }) => multiple ? '100px' : 'none'};
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 1.1em;
    min-width: ${({ multiple }) => multiple ? 'none' : '180px'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-weight: bold;
    max-width: none;
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

const DiagramSvg = styled.svg``;
const DiagramSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  @media print {
    display: none;
  }
`;

const PathLineCustom = styled(PathLine)`
  stroke: ${palette('dark', 2)};
  stroke-width: 0.5px;
  fill: none;
`;
const PathLineArrow = styled(PathLine)`
  fill: ${palette('dark', 2)};
`;
const SectionLabel = styled.div`
  color: ${palette('text', 1)};
  font-size: ${(props) => props.theme.sizes.text.small};
  margin-top: 5px;
  position: absolute;
  left: 0;
  top: 0;
  @media print {
    font-size: ${(props) => props.theme.sizes.print.small};
  }
`;

export class VerticalDiagram extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.itemRefs = {};
    this.state = {
      diagramVersion: 0, // trigger re-render of DiagramSVG
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    console.log('resize')
    // reset
    this.itemRefs={};
    this.setState((prev) => ({ diagramVersion: (prev.diagramVersion || 0) + 1 }));
  };

  setItemRef = (ref, key) => {
    if (ref && !this.itemRefs[key]) {
      this.itemRefs[key] = ref;
      // Force update to re-render DiagramSVG and cause effect to re-run
      this.setState((prev) => ({ diagramVersion: (prev.diagramVersion || 0) + 1 }));
    }

  };

  render() {
    const {
      frameworks,
      recommendationCountByFw,
      recommendationDraftCountByFw,
      measureCount,
      measureDraftCount,
      indicatorCount,
      indicatorDraftCount,
      onPageLink,
      intl,
    } = this.props;
    return (
      <Diagram
        ref={(node) => {
          this.setItemRef(node, 'diagram');
        }}
      >
        <VerticalDiagramSVG
          frameworks={frameworks}
          itemRefs={this.itemRefs}
          version={this.state.diagramVersion}
        />
        <div>
          <DiagramSectionVertical>
            <SectionLabel>
              <FormattedMessage {...appMessages.nav.recommendationsSuper} />
            </SectionLabel>
            <DiagramSectionVerticalCenter>
              {frameworks && frameworks.valueSeq().map(
                (fw) => {
                  const fwId = isNumber(fw.get('id')) ? parseInt(fw.get('id'), 10) : fw.get('id');
                  return (
                    <DiagramButtonWrap key={fwId} multiple={frameworks.size > 1}>
                      <VerticalDiagramButton
                        path={ROUTES.RECOMMENDATIONS}
                        query={frameworks.size > 1 && {
                          arg: 'fwx',
                          value: fwId,
                          replace: true,
                        }}
                        paletteDefault="recommendations"
                        paletteHover="recommendationsHover"
                        icon={`recommendations_${fwId}`}
                        type={`recommendations_${fwId}`}
                        count={recommendationCountByFw.get(fwId)}
                        draftCount={recommendationDraftCountByFw.get(fwId)}
                        multiple={frameworks.size > 1}
                        onPageLink={onPageLink}
                        intl={intl}
                        ref={(node) => {
                          this.setItemRef(node, `buttonRecs_${fwId}`);
                        }}
                      />
                    </DiagramButtonWrap>
                  );
                }
              )}
            </DiagramSectionVerticalCenter>
          </DiagramSectionVertical>
          <DiagramSectionVertical>
            <SectionLabel>
              <FormattedMessage {...appMessages.nav.measuresSuper} />
            </SectionLabel>
            <DiagramSectionVerticalCenter>
              <DiagramButtonWrap>
                <VerticalDiagramButton
                  path={ROUTES.MEASURES}
                  paletteDefault="measures"
                  paletteHover="measuresHover"
                  icon="measures"
                  type="measures"
                  count={measureCount}
                  draftCount={measureDraftCount}
                  intl={intl}
                  ref={(node) => {
                    this.setItemRef(node, 'buttonMeasures');
                  }}
                />
              </DiagramButtonWrap>
            </DiagramSectionVerticalCenter>
          </DiagramSectionVertical>
          <DiagramSectionVertical>
            <SectionLabel>
              <FormattedMessage {...appMessages.nav.indicatorsSuper} />
            </SectionLabel>
            <DiagramSectionVerticalCenter>
              <DiagramButtonWrap>
                <VerticalDiagramButton
                  path={ROUTES.INDICATORS}
                  paletteDefault="indicators"
                  paletteHover="indicatorsHover"
                  icon="indicators"
                  type="indicators"
                  count={indicatorCount}
                  draftCount={indicatorDraftCount}
                  intl={intl}
                  ref={(node) => {
                    this.setItemRef(node, 'buttonIndicators');
                  }}
                />
              </DiagramButtonWrap>
            </DiagramSectionVerticalCenter>
          </DiagramSectionVertical>
        </div>
      </Diagram>
    );
  }
}

VerticalDiagram.propTypes = {
  frameworks: PropTypes.object,
  onPageLink: PropTypes.func,
  recommendationCountByFw: PropTypes.object,
  measureCount: PropTypes.number,
  indicatorCount: PropTypes.number,
  recommendationDraftCountByFw: PropTypes.object,
  measureDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
  theme: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(withTheme(VerticalDiagram));
