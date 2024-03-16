/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { PathLine } from 'react-svg-pathline';
import { palette } from 'styled-theme';

import styled, { withTheme } from 'styled-components';

import { ROUTES, VIEWPORTS } from 'containers/App/constants';
import { ENABLE_SDGS } from 'themes/config';

import appMessages from 'containers/App/messages';

// components
import Button from 'components/buttons/Button';
import Icon from 'components/Icon';

// relative
import messages from './messages';

const Diagram = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    margin-bottom: 180px;
  }
`;
const DiagramSectionHorizontalHalf = styled.div`
  display: inline-block;
  width: 25%;
  position: relative;
  height: 260px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    height: 300px;
  }
`;

const DiagramSectionHorizontalCenter = styled.div`
  display: inline-block;
  width: 50%;
  position: relative;
  height: 260px;
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    height: 300px;
  }
`;

const DiagramSectionHorizontalTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  width: 100%;
`;
const DiagramSectionHorizontalBottom = styled(DiagramSectionHorizontalTop)`
  bottom: 0;
  top: auto;
`;

const DiagramSectionHorizontalVCenter = styled.div`
  position: absolute;
  left: 0;
  text-align: center;
  width: 100%;
  top: 50%;
  transform: translate(0, -50%);
`;

const DiagramSectionVertical = styled.div`
  display: block;
  position: relative;
  text-align: center;
`;

const DiagramSectionVerticalHalf = styled.div`
  display: inline-block;
  width: 50%;
  position: relative;
`;

const DiagramSectionVerticalCenter = styled.div`
  display: block;
  margin: 0 auto;
  position: relative;
`;

const Annotation = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  text-align: center;
  word-spacing: 1000000px;
  width: 200px;
  color: ${palette('text', 1)};
  line-height: 1.1;
  font-size: 0.85em;
  margin-top: 1.6em;
  left: ${(props) => props.hasSDGs ? 31 : 30}%;
`;
const AnnotationMeasured = styled(Annotation)`
  left: 70%;
`;
const AnnotationVertical = styled.div`
  text-align: center;
  color: ${palette('text', 1)};
  line-height: 1.1;
  background-color: ${palette('background', 1)};
  position: relative;
  width: 200px;
  margin: 0 auto;
  font-size: 0.8em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 0.85em;
  }
`;

const Categorised = styled.div`
  border-bottom: 1px solid ${palette('light', 4)};
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 0 5px;
  color: ${palette('text', 1)};
  font-weight: normal;
  font-size: 0.75em;
  background-color: ${palette('background', 1)};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    position: absolute;
    top: 100%;
    width: 100%;
    left: 0;
    text-align: left;
    border-top: 1px solid ${palette('light', 4)};
    border-bottom: 0;
    padding-bottom: 0;
    margin: 0;
  }
`;

const CategorisedIcons = styled.div``;

const CategorisedIcon = styled.a`
  display: inline-block;
  padding: 0;
  color: ${(props) => props.active ? palette('taxonomiesTextColor', props.paletteId) : palette('text', 1)};
  background-color: ${(props) => props.active ? palette('taxonomies', props.paletteId) : 'transparent'};
  border-radius: 4px;
  &:hover, &:focus {
    color: ${(props) => palette('taxonomiesTextColor', props.paletteId)};
    background-color: ${(props) => palette('taxonomies', props.paletteId)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 1px;
    margin: 0 1px;
  }
`;
// color: ${(props) => props.active ? palette('primary', 0) : palette('dark', 3)};
// &:hover {
//   color: ${palette('primary', 0)};
// }
const DiagramButtonWrap = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 1.1em;
  padding: 1.1em 0;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    margin-bottom: 0;
    padding: 0.5em 0;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 1em 0;
  }
`;
// color: ${palette('primary', 4)};
// &:hover {
//   color: ${palette('primary', 4)};
//   background-color: ${palette('primary', 1)};
// }
// background-color: ${palette('primary', 1)};

const DiagramButton = styled(Button)`
  background-color: ${(props) => palette(props.paletteDefault, 0)};
  &:hover {
    background-color: ${(props) => palette(props.paletteHover, 0)};
  }
  color: ${(props) => props.fontColor ? palette(props.fontColor, props.fontColorIndex) : palette('primary', 4)};
  padding: 0.4em 0.5em 0.75em;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  font-size: 0.8em;
  border-radius: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    border-radius: 999px;
    font-weight: bold;
    font-size: 1.1em;
    padding: 0.4em 1.2em 1em;
    min-width: 180px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0.6em 1.2em 1.4em;
  }
`;
// font-size: ${(props) => props.theme.sizes.text.aaLargeBold};

const DiagramButtonMain = styled(DiagramButton)`
  background-color: ${(props) => palette(props.paletteDefault, 0)};
  &:hover {
    background-color: ${(props) => palette(props.paletteHover, 0)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0.4em 0.75em 1em;
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      padding-top: 100%;
    }
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    min-width: 230px;
  }
`;
const DiagramButtonMainInside = styled.span`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: inline-block;
    vertical-align: middle;
    margin-top: -30px;
  }
`;
const DiagramButtonIcon = styled.div`
  padding-bottom: 5px;
`;

const DraftEntities = styled.div`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    display: block;
    font-size: 0.85em;
    font-weight: normal;
    position: absolute;
    left: 0;
    right: 0;
  }
`;

const DiagramButtonMainTop = styled.div`
  padding-bottom: 0.2px;
  font-weight: bold;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 1.3em;
    padding-bottom: 5px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: 1.1em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    font-size: 1.3em;
    padding-bottom: 5px;
  }
`;
// font-size: ${(props) => props.theme.sizes.text.aaLarge};
const DiagramButtonMainBottom = styled.div`
  font-weight: normal;
`;

const DiagramSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const PathLineCustom = styled(PathLine)`
  stroke: ${palette('dark', 2)};
  stroke-width: 0.5px;
  fill: none;
`;
const PathLineArrow = styled(PathLine)`
  fill: ${palette('dark', 2)};
`;

const STATE_INITIAL = {
  diagram: null,
  buttonRecs: null,
  buttonMeasures: null,
  buttonIndicators: null,
  buttonSdgtargets: null,
  mouseOverTaxonomy: null,
  mouseOverTaxonomyDiagram: null,
  viewport: null,
};

export class HorizontalDiagram extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = STATE_INITIAL;
  }

  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getTaxonomiesByTagging = (taxonomies, tags) => taxonomies.filter(
    (tax) => tax.getIn(['attributes', tags])
  );

  getConnectionPoint = (node, nodeReference, side = 'right') => {
    const boundingRect = node.getBoundingClientRect();
    const boundingRectReference = nodeReference.getBoundingClientRect();

    if (side === 'right' || side === 'left') {
      return ({
        x: side === 'right'
          ? (boundingRect.right - boundingRectReference.left)
          : (boundingRect.left - boundingRectReference.left),
        y: (boundingRect.top - boundingRectReference.top)
          + (((boundingRect.bottom - boundingRectReference.top) - (boundingRect.top - boundingRectReference.top)) / 2),
      });
    }
    return ({
      x: (boundingRect.left - boundingRectReference.left)
        + (((boundingRect.right - boundingRectReference.left) - (boundingRect.left - boundingRectReference.left)) / 2),
      y: side === 'bottom'
        ? (boundingRect.bottom - boundingRectReference.top)
        : (boundingRect.top - boundingRectReference.top),
    });
  };

  getConnectionPath = (vertical = false, start, end) => vertical
    ? [
      { x: start.x, y: start.y + 5 },
      { x: end.x, y: end.y - 5 },
    ]
    : [
      { x: start.x + 5, y: start.y },
      { x: end.x - 5, y: end.y },
    ];

  getCurvedConnectionPath = (vertical = false, start, end, curve = 0.2) => vertical
    ? [
      { x: start.x, y: start.y + 5 },
      { x: start.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: end.y - 5 },
    ]
    : [
      { x: start.x + 5, y: start.y },
      { x: (start.x + 5) + ((end.x - start.x - 10) * curve), y: start.y },
      { x: (start.x + 5) + ((end.x - start.x - 10) * curve), y: end.y },
      { x: end.x - 5, y: end.y },
    ];


  getConnectionPathArrow = (connectionPath, vertical = false) => {
    const point = connectionPath[connectionPath.length - 1];
    return vertical
      ? [
        point,
        { x: point.x - 5, y: point.y - 5 },
        { x: point.x + 5, y: point.y - 5 },
        point,
      ]
      : [
        point,
        { x: point.x - 5, y: point.y - 5 },
        { x: point.x - 5, y: point.y + 5 },
        point,
      ];
  };

  updateViewport() {
    let viewport = VIEWPORTS.MOBILE;
    if (window.innerWidth >= parseInt(this.props.theme.breakpoints.large, 10)) {
      viewport = VIEWPORTS.LARGE;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.medium, 10)) {
      viewport = VIEWPORTS.MEDIUM;
    } else if (window.innerWidth >= parseInt(this.props.theme.breakpoints.small, 10)) {
      viewport = VIEWPORTS.SMALL;
    }
    this.setState({ viewport });
  }

  connectRecommendationsMeasures = (vertical = false) => ENABLE_SDGS
    ? this.getCurvedConnectionPath(
      vertical,
      this.getConnectionPoint(this.state.buttonRecs, this.state.diagram, vertical ? 'bottom' : 'right'),
      this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, vertical ? 'top' : 'left'),
      vertical ? 0.6 : 0.2
    )
    : this.getConnectionPath(
      vertical,
      this.getConnectionPoint(this.state.buttonRecs, this.state.diagram, vertical ? 'bottom' : 'right'),
      this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, vertical ? 'top' : 'left'),
    );

  connectSdgtargetsMeasures = (vertical = false) => this.getCurvedConnectionPath(
    vertical,
    this.getConnectionPoint(this.state.buttonSdgtargets, this.state.diagram, vertical ? 'bottom' : 'right'),
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, vertical ? 'top' : 'left'),
    vertical ? 0.6 : 0.2
  );

  connectMeasuresIndicators = (vertical = false) => this.getConnectionPath(
    vertical,
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, vertical ? 'bottom' : 'right'),
    this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, vertical ? 'top' : 'left'),
    vertical ? 0.6 : 0.2
  );

  connectSdgtargetsIndicators = (vertical = false) => this.getCurvedConnectionPath(
    vertical,
    this.getConnectionPoint(this.state.buttonSdgtargets, this.state.diagram, vertical ? 'bottom' : 'right'),
    this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, vertical ? 'top' : 'left'),
    0.9
  );

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
  };

  renderTaxonomyIcons = (
    taxonomies,
    activeTaxonomyId,
    onPageLink,
    onTaxonomyIconMouseOver,
  ) => (
    <CategorisedIcons>
      {taxonomies.toList().map((tax, i) => (
        <CategorisedIcon
          key={i}
          href={`${ROUTES.TAXONOMIES}/${tax.get('id')}`}
          paletteId={parseInt(tax.get('id'), 10)}
          onClick={(evt) => {
            if (evt !== undefined && evt.preventDefault) evt.preventDefault();
            onPageLink(`${ROUTES.TAXONOMIES}/${tax.get('id')}`);
          }}
          onMouseOver={() => onTaxonomyIconMouseOver(tax.get('id'))}
          onFocus={() => onTaxonomyIconMouseOver(tax.get('id'))}
          onMouseOut={() => onTaxonomyIconMouseOver(tax.get('id'), false)}
          onBlur={() => onTaxonomyIconMouseOver(tax.get('id'), false)}
          active={activeTaxonomyId === tax.get('id')}
          title={this.context.intl.formatMessage(appMessages.entities.taxonomies[tax.get('id')].plural)}
        >
          <Icon
            name={`taxonomy_${tax.get('id')}`}
            size={this.state.viewport < VIEWPORTS.SMALL ? '1.6em' : '2em'}
          />
        </CategorisedIcon>
      ))}
    </CategorisedIcons>
  );

  renderPath = (points = [], dashed = false, r = 10) => (
    <PathLineCustom
      points={points}
      strokeDasharray={dashed ? '5,5' : null}
      r={r}
    />
  );

  renderArrow = (points = [], vertical = false) => (
    <PathLineArrow
      points={this.getConnectionPathArrow(points, vertical)}
      r={0}
    />
  );

  renderPathsSVG = (vertical = false) => (
    <DiagramSvgWrapper>
      {this.state.diagram && (
        <svg
          width={this.state.diagram.getBoundingClientRect().width}
          height={this.state.diagram.getBoundingClientRect().height}
        >
          {this.state.buttonRecs
            && this.state.buttonMeasures
            && this.renderPath(this.connectRecommendationsMeasures(vertical))
          }
          {this.state.buttonRecs
            && this.state.buttonMeasures
            && this.renderArrow(this.connectRecommendationsMeasures(vertical), vertical)
          }
          {this.state.buttonIndicators
            && this.state.buttonMeasures
            && this.renderPath(this.connectMeasuresIndicators(vertical))
          }
          {this.state.buttonIndicators
            && this.state.buttonMeasures
            && this.renderArrow(this.connectMeasuresIndicators(vertical), vertical)
          }
          {ENABLE_SDGS
            && this.state.buttonSdgtargets
            && this.state.buttonIndicators
            && this.renderPath(this.connectSdgtargetsIndicators(vertical), true)
          }
          {ENABLE_SDGS
            && this.state.buttonSdgtargets
            && this.state.buttonMeasures
            && this.renderPath(this.connectSdgtargetsMeasures(vertical))
          }
        </svg>
      )}
    </DiagramSvgWrapper>
  );

  renderButton = ({
    path,
    paletteDefault,
    paletteHover,
    fontColorIndex,
    fontColor,
    icon,
    type,
    count,
    draftCount,
    stateButton,
    onPageLink,
  }) => (
    <DiagramButton
      onClick={() => onPageLink(path)}
      paletteDefault={paletteDefault}
      paletteHover={paletteHover}
      fontColorIndex={fontColorIndex}
      fontColor={fontColor}
      ref={(node) => {
        if (!this.state[stateButton]) {
          this.setState({ [stateButton]: node });
        }
      }}
    >
      <DiagramButtonIcon>
        <Icon name={icon} />
      </DiagramButtonIcon>
      <div>
        {`${count || 0} ${this.context.intl.formatMessage(appMessages.entities[type][count !== 1 ? 'plural' : 'single'])}`}
      </div>
      {draftCount > 0 && (
        <DraftEntities>
          <FormattedMessage
            {...messages.buttons.draft}
            values={{ count: draftCount }}
          />
        </DraftEntities>
      )}
    </DiagramButton>
  );

  renderCategoryIcons = (
    tags,
    taxonomies,
    onPageLink,
    onTaxonomyIconMouseOver,
    mouseOverTaxonomy,
  ) => (
    <Categorised>
      <FormattedMessage {...messages.diagram.categorised} />
      {
        this.renderTaxonomyIcons(
          this.getTaxonomiesByTagging(taxonomies, tags),
          mouseOverTaxonomy,
          onPageLink,
          onTaxonomyIconMouseOver,
        )
      }
    </Categorised>
  );

  renderRecommendationsButton = (
    recommendationCount,
    recommendationDraftCount,
    taxonomies,
    onPageLink,
    onTaxonomyIconMouseOver,
    frameworkId,
    mouseOverTaxonomy,
  ) => (
    <DiagramButtonWrap>
      {this.renderButton({
        path: ROUTES.RECOMMENDATIONS,
        paletteDefault: 'recommendations',
        paletteHover: 'recommendationsHover',
        icon: 'recommendations',
        type: `recommendations_${frameworkId}`,
        count: recommendationCount,
        draftCount: recommendationDraftCount,
        stateButton: 'buttonRecs',
        onPageLink,
      })}
      {this.renderCategoryIcons(
        'tags_recommendations',
        taxonomies,
        onPageLink,
        onTaxonomyIconMouseOver,
        mouseOverTaxonomy,
      )}
    </DiagramButtonWrap>
  );

  renderMeasuresButton = (
    measureCount,
    measureDraftCount,
    taxonomies,
    onPageLink,
    onTaxonomyIconMouseOver,
    mouseOverTaxonomy,
  ) => {
    let iconSize = '5em';
    if (this.state.viewport === VIEWPORTS.MOBILE) {
      iconSize = null;
    }
    if (this.state.viewport === VIEWPORTS.MEDIUM) {
      iconSize = '4em';
    }
    const taxonomiesByTagging = taxonomies && this.getTaxonomiesByTagging(taxonomies, 'tags_measures');
    return (
      <DiagramButtonWrap>
        <DiagramButtonMain
          onClick={() => onPageLink(ROUTES.MEASURES)}
          paletteDefault="measures"
          paletteHover="measuresHover"
          ref={(node) => {
            if (!this.state.buttonMeasures) {
              this.setState({ buttonMeasures: node });
            }
          }}
        >
          <DiagramButtonMainInside>
            <DiagramButtonIcon>
              <Icon name="measures" size={iconSize} />
            </DiagramButtonIcon>
            <DiagramButtonMainTop>
              <FormattedMessage {...messages.buttons.measuresTitle} />
            </DiagramButtonMainTop>
            <DiagramButtonMainBottom>
              <FormattedMessage {...messages.buttons.measuresAdditional} values={{ count: measureCount || '0' }} />
            </DiagramButtonMainBottom>
            {measureDraftCount > 0 && (
              <DraftEntities>
                <FormattedMessage {...messages.buttons.draft} values={{ count: measureDraftCount }} />
              </DraftEntities>
            )}
          </DiagramButtonMainInside>
        </DiagramButtonMain>
        {taxonomiesByTagging.size > 0
          && this.renderCategoryIcons(
            'tags_measures',
            taxonomies,
            onPageLink,
            onTaxonomyIconMouseOver,
            mouseOverTaxonomy,
          )
        }
      </DiagramButtonWrap>
    );
  };

  renderIndicatorButton = (
    indicatorCount,
    indicatorDraftCount,
    onPageLink,
  ) => (
    <DiagramButtonWrap>
      {this.renderButton({
        path: ROUTES.INDICATORS,
        paletteDefault: 'indicators',
        paletteHover: 'indicatorsHover',
        icon: 'indicators',
        type: 'indicators',
        fontColorIndex: 0,
        fontColor: 'dark',
        count: indicatorCount,
        draftCount: indicatorDraftCount,
        stateButton: 'buttonIndicators',
        onPageLink,
      })}
    </DiagramButtonWrap>
  );

  renderSdgtargetButton = (
    sdgtargetCount,
    sdgtargetDraftCount,
    taxonomies,
    onPageLink,
    onTaxonomyIconMouseOver,
    mouseOverTaxonomy,
  ) => (
    <DiagramButtonWrap>
      {this.renderButton({
        path: ROUTES.SDG_TARGETS,
        paletteDefault: 'sdgtargets',
        paletteHover: 'sdgtargetsHover',
        icon: 'sdgtargets',
        message: 'sdgtargets',
        count: sdgtargetCount,
        draftCount: sdgtargetDraftCount,
        stateButton: 'buttonSdgtargets',
        onPageLink,
      })}
      {this.renderCategoryIcons(
        'tags_sdgtargets',
        onPageLink,
        onTaxonomyIconMouseOver,
        mouseOverTaxonomy,
      )}
    </DiagramButtonWrap>
  );

  render() {
    const {
      taxonomies,
      recommendationCount,
      recommendationDraftCount,
      sdgtargetCount,
      sdgtargetDraftCount,
      measureCount,
      measureDraftCount,
      indicatorCount,
      indicatorDraftCount,
      onPageLink,
      onTaxonomyIconMouseOver,
      frameworkId,
      mouseOverTaxonomy,
    } = this.props;

    return (
      <Diagram
        ref={(node) => {
          if (!this.state.diagram) {
            this.setState({ diagram: node });
          }
        }}
      >
        {this.renderPathsSVG(this.state.viewport < VIEWPORTS.MEDIUM)}
        {this.state.viewport
          && this.state.viewport < VIEWPORTS.MEDIUM
          && (
            <div>
              <DiagramSectionVertical>
                {ENABLE_SDGS && (
                  <DiagramSectionVerticalHalf>
                    {this.renderRecommendationsButton(
                      recommendationCount,
                      recommendationDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      frameworkId,
                      mouseOverTaxonomy,
                    )}
                  </DiagramSectionVerticalHalf>
                )}
                {!ENABLE_SDGS && (
                  <DiagramSectionVerticalCenter>
                    {this.renderRecommendationsButton(
                      recommendationCount,
                      recommendationDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      frameworkId,
                      mouseOverTaxonomy,
                    )}
                  </DiagramSectionVerticalCenter>
                )}
                {ENABLE_SDGS && (
                  <DiagramSectionVerticalHalf>
                    {this.renderSdgtargetButton(
                      sdgtargetCount,
                      sdgtargetDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      mouseOverTaxonomy,
                    )}
                  </DiagramSectionVerticalHalf>
                )}
              </DiagramSectionVertical>
              <AnnotationVertical hasSDGs={ENABLE_SDGS}>
                <FormattedMessage {...messages.diagram.addressed} />
              </AnnotationVertical>
              <DiagramSectionVertical>
                <DiagramSectionVerticalCenter>
                  {this.renderMeasuresButton(
                    measureCount,
                    measureDraftCount,
                    taxonomies,
                    onPageLink,
                    onTaxonomyIconMouseOver,
                    mouseOverTaxonomy,
                  )}
                </DiagramSectionVerticalCenter>
              </DiagramSectionVertical>
              <AnnotationVertical>
                <FormattedMessage {...messages.diagram.measured} />
              </AnnotationVertical>
              <DiagramSectionVertical>
                <DiagramSectionVerticalCenter>
                  {this.renderIndicatorButton(
                    indicatorCount,
                    indicatorDraftCount,
                    onPageLink,
                  )}
                </DiagramSectionVerticalCenter>
              </DiagramSectionVertical>
            </div>
          )}
        {this.state.viewport >= VIEWPORTS.MEDIUM
          && ( // HORIZONTAL
            <div>
              <DiagramSectionHorizontalHalf>
                {ENABLE_SDGS && (
                  <DiagramSectionHorizontalTop>
                    {this.renderRecommendationsButton(
                      recommendationCount,
                      recommendationDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      frameworkId,
                      mouseOverTaxonomy,
                    )}
                  </DiagramSectionHorizontalTop>
                )}
                {!ENABLE_SDGS && (
                  <DiagramSectionHorizontalVCenter>
                    {this.renderRecommendationsButton(
                      recommendationCount,
                      recommendationDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      frameworkId,
                      mouseOverTaxonomy,
                    )}
                  </DiagramSectionHorizontalVCenter>
                )}
                {ENABLE_SDGS && (
                  <DiagramSectionHorizontalBottom>
                    {this.renderSdgtargetButton(
                      sdgtargetCount,
                      sdgtargetDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      mouseOverTaxonomy,
                    )}
                  </DiagramSectionHorizontalBottom>
                )}
              </DiagramSectionHorizontalHalf>
              <Annotation hasSDGs={ENABLE_SDGS}>
                <FormattedMessage {...messages.diagram.addressed} />
              </Annotation>
              <DiagramSectionHorizontalCenter>
                <DiagramSectionHorizontalVCenter>
                  {
                    this.renderMeasuresButton(
                      measureCount,
                      measureDraftCount,
                      taxonomies,
                      onPageLink,
                      onTaxonomyIconMouseOver,
                      mouseOverTaxonomy,
                    )
                  }
                </DiagramSectionHorizontalVCenter>
              </DiagramSectionHorizontalCenter>
              <AnnotationMeasured>
                <FormattedMessage {...messages.diagram.measured} />
              </AnnotationMeasured>
              <DiagramSectionHorizontalHalf>
                <DiagramSectionHorizontalVCenter>
                  {this.renderIndicatorButton(
                    indicatorCount,
                    indicatorDraftCount,
                    onPageLink,
                  )}
                </DiagramSectionHorizontalVCenter>
              </DiagramSectionHorizontalHalf>
            </div>
          )}
      </Diagram>
    );
  }
}

HorizontalDiagram.propTypes = {
  onPageLink: PropTypes.func,
  onTaxonomyIconMouseOver: PropTypes.func,
  taxonomies: PropTypes.object,
  recommendationCount: PropTypes.number,
  measureCount: PropTypes.number,
  sdgtargetCount: PropTypes.number,
  indicatorCount: PropTypes.number,
  recommendationDraftCount: PropTypes.number,
  measureDraftCount: PropTypes.number,
  sdgtargetDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
  frameworkId: PropTypes.string,
  mouseOverTaxonomy: PropTypes.string,
  theme: PropTypes.object,
};

HorizontalDiagram.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default withTheme(HorizontalDiagram);
