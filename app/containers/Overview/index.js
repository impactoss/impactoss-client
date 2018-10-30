/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { PathLine } from 'react-svg-pathline';
import { palette } from 'styled-theme';

import styled, { withTheme } from 'styled-components';

import { mapToTaxonomyList } from 'utils/taxonomies';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectTaxonomiesSorted,
  selectReady,
} from 'containers/App/selectors';
import { PATHS, CONTENT_LIST, VIEWPORTS } from 'containers/App/constants';
import { ENABLE_SDGS } from 'themes/config';

import appMessages from 'containers/App/messages';

// components
import Button from 'components/buttons/Button';
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Icon from 'components/Icon';
import Loading from 'components/Loading';

import ContentHeader from 'components/ContentHeader';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';

// relative
import messages from './messages';
import { DEPENDENCIES } from './constants';
import {
  selectRecommendationCount,
  selectIndicatorCount,
  selectMeasureCount,
  selectSdgtargetCount,
  selectRecommendationDraftCount,
  selectIndicatorDraftCount,
  selectMeasureDraftCount,
  selectSdgtargetDraftCount,
} from './selectors';

const Content = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 1em;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0 2em;
  }
`;
const Description = styled.p`
  margin-bottom: 1.5em;
  font-size: 1em;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    margin-bottom: 2em;
    font-size: 1.1em;
  }
`;
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
  margin-top: -2em;
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
  color: ${(props) => props.active ? palette('taxonomies', props.paletteId) : palette('text', 1)};
  &:hover {
    color: ${(props) => palette('taxonomies', props.paletteId)};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    padding: 0 2px;
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
  color: ${palette('primary', 4)};
  padding: 0.4em 0.5em 0.75em;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  font-size: 0.8em;
  border-radius: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    border-radius: 999px;
    font-weight: bold;
    font-size: 1.1em;
    padding: 0.4em 0.5em 1em;
    min-width: 180px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: 0.6em 1em 1.4em;
  }
`;
// font-size: ${(props) => props.theme.sizes.text.aaLargeBold};

const DiagramButtonMain = styled(DiagramButton)`
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

export class Overview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = STATE_INITIAL;
  }
  // make sure to load all data from server
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
  }
  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.resize);
  }
  componentWillReceiveProps(nextProps) {
    // reload entities if invalidated
    if (!nextProps.dataReady) {
      this.props.loadEntitiesIfNeeded();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onTaxonomyIconMouseOver = (taxonomyId, isOver = true) => {
    this.setState({
      mouseOverTaxonomyDiagram: isOver ? taxonomyId : null,
    });
  }

  onTaxonomyMouseOver = (taxonomyId, isOver = true) => {
    this.setState({
      mouseOverTaxonomy: isOver ? taxonomyId : null,
    });
  }

  getTaxonomiesByTagging = (taxonomies, tags) =>
    taxonomies.filter((tax) => tax.getIn(['attributes', tags]))

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
  }

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
  }
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
  connectSdgtargetsIndicators = (vertical = false) =>
    this.getCurvedConnectionPath(
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

  renderTaxonomyIcons = (taxonomies, activeTaxonomyId) => (
    <CategorisedIcons>
      {
        taxonomies.toList().map((tax, i) =>
          (
            <CategorisedIcon
              key={i}
              href={`${PATHS.TAXONOMIES}/${tax.get('id')}`}
              paletteId={parseInt(tax.get('id'), 10)}
              onClick={(evt) => {
                if (evt !== undefined && evt.preventDefault) evt.preventDefault();
                this.props.onPageLink(`${PATHS.TAXONOMIES}/${tax.get('id')}`);
              }}
              onMouseOver={() => this.onTaxonomyIconMouseOver(tax.get('id'))}
              onFocus={() => this.onTaxonomyIconMouseOver(tax.get('id'))}
              onMouseOut={() => this.onTaxonomyIconMouseOver(tax.get('id'), false)}
              onBlur={() => this.onTaxonomyIconMouseOver(tax.get('id'), false)}
              active={activeTaxonomyId === tax.get('id')}
              title={this.context.intl.formatMessage(appMessages.entities.taxonomies[tax.get('id')].plural)}
            >
              <Icon name={`taxonomy_${tax.get('id')}`} size={this.state.viewport < VIEWPORTS.SMALL ? '1.6em' : '2em'} />
            </CategorisedIcon>
          )
        )
      }
    </CategorisedIcons>
  )

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
      { this.state.diagram &&
        <svg
          width={this.state.diagram.getBoundingClientRect().width}
          height={this.state.diagram.getBoundingClientRect().height}
        >
          { this.state.buttonRecs && this.state.buttonMeasures &&
            this.renderPath(this.connectRecommendationsMeasures(vertical))
          }
          { this.state.buttonRecs && this.state.buttonMeasures &&
            this.renderArrow(this.connectRecommendationsMeasures(vertical), vertical)
          }
          { this.state.buttonIndicators && this.state.buttonMeasures &&
            this.renderPath(this.connectMeasuresIndicators(vertical))
          }
          { this.state.buttonIndicators && this.state.buttonMeasures &&
            this.renderArrow(this.connectMeasuresIndicators(vertical), vertical)
          }
          {ENABLE_SDGS && this.state.buttonSdgtargets && this.state.buttonIndicators &&
            this.renderPath(this.connectSdgtargetsIndicators(vertical), true)
          }
          {ENABLE_SDGS && this.state.buttonSdgtargets && this.state.buttonMeasures &&
            this.renderPath(this.connectSdgtargetsMeasures(vertical))
          }
        </svg>
      }
    </DiagramSvgWrapper>
  );

  renderButton = ({ path, paletteDefault, paletteHover, icon, message, count, draftCount, stateButton }) => (
    <DiagramButton
      onClick={() => this.props.onPageLink(path)}
      paletteDefault={paletteDefault}
      paletteHover={paletteHover}
      innerRef={(node) => {
        if (!this.state[stateButton]) {
          this.setState({ [stateButton]: node });
        }
      }}
    >
      <DiagramButtonIcon>
        <Icon name={icon} />
      </DiagramButtonIcon>
      <div>
        <FormattedMessage {...messages.buttons[message]} values={{ count: count || '0' }} />
      </div>
      { draftCount > 0 &&
        <DraftEntities>
          <FormattedMessage {...messages.buttons.draft} values={{ count: draftCount }} />
        </DraftEntities>
      }
    </DiagramButton>
  )
  renderCategoryIcons = (tags) => (
    <Categorised>
      <FormattedMessage {...messages.diagram.categorised} />
      {
        this.renderTaxonomyIcons(
          this.getTaxonomiesByTagging(this.props.taxonomies, tags),
          this.state.mouseOverTaxonomy || this.state.mouseOverTaxonomyDiagram
        )
      }
    </Categorised>
  );

  renderRecommendationsButton = () => (
    <DiagramButtonWrap>
      {this.renderButton({
        path: PATHS.RECOMMENDATIONS,
        paletteDefault: 'recommendations',
        paletteHover: 'recommendationsHover',
        stateButton: 'buttonRecs',
        icon: 'recommendations',
        message: 'recommendations',
        count: this.props.recommendationCount,
        draftCount: this.props.recommendationDraftCount,
      })}
      {this.renderCategoryIcons('tags_recommendations')}
    </DiagramButtonWrap>
  );
  renderMeasuresButton = () => {
    let iconSize = '5em';
    if (this.state.viewport === VIEWPORTS.MOBILE) {
      iconSize = null;
    }
    if (this.state.viewport === VIEWPORTS.MEDIUM) {
      iconSize = '4em';
    }
    return (
      <DiagramButtonWrap>
        <DiagramButtonMain
          onClick={() => this.props.onPageLink(PATHS.MEASURES)}
          paletteDefault={'measures'}
          paletteHover={'measuresHover'}
          innerRef={(node) => {
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
              <FormattedMessage {...messages.buttons.measures} />
            </DiagramButtonMainTop>
            <DiagramButtonMainBottom>
              <FormattedMessage {...messages.buttons.measuresAdditional} values={{ count: this.props.measureCount || '0' }} />
            </DiagramButtonMainBottom>
            { this.props.measureDraftCount > 0 &&
              <DraftEntities>
                <FormattedMessage {...messages.buttons.draft} values={{ count: this.props.measureDraftCount }} />
              </DraftEntities>
            }
          </DiagramButtonMainInside>
        </DiagramButtonMain>
        { this.getTaxonomiesByTagging(this.props.taxonomies, 'tags_measures').size > 0 &&
          this.renderCategoryIcons('tags_measures')
        }
      </DiagramButtonWrap>
    );
  };

  renderIndicatorButton = () => (
    <DiagramButtonWrap>
      {this.renderButton({
        path: PATHS.INDICATORS,
        paletteDefault: 'indicators',
        paletteHover: 'indicatorsHover',
        stateButton: 'buttonIndicators',
        icon: 'indicators',
        message: 'indicators',
        count: this.props.indicatorCount,
        draftCount: this.props.indicatorDraftCount,
      })}
    </DiagramButtonWrap>
  );
  renderSdgtargetButton = () => (
    <DiagramButtonWrap>
      { this.renderButton({
        path: PATHS.SDG_TARGETS,
        paletteDefault: 'sdgtargets',
        paletteHover: 'sdgtargetsHover',
        stateButton: 'buttonSdgtargets',
        icon: 'sdgtargets',
        message: 'sdgtargets',
        count: this.props.sdgtargetCount,
        draftCount: this.props.sdgtargetDraftCount,
      }) }
      { this.renderCategoryIcons('tags_sdgtargets') }
    </DiagramButtonWrap>
  );
  render() {
    const {
      dataReady,
      onTaxonomyLink,
      taxonomies,
    } = this.props;

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.title)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !dataReady &&
          <EntityListSidebarLoading responsiveSmall />
        }
        { dataReady &&
          <TaxonomySidebar
            taxonomies={mapToTaxonomyList(
              taxonomies,
              onTaxonomyLink,
              this.state.mouseOverTaxonomyDiagram,
              this.onTaxonomyMouseOver,
            )}
          />
        }
        <ContainerWithSidebar sidebarResponsiveSmall>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                supTitle={this.context.intl.formatMessage(messages.supTitle)}
                title={this.context.intl.formatMessage(messages.title)}
              />
              <Description>
                <FormattedMessage {...messages.description} />
              </Description>
              { !dataReady &&
                <Loading />
              }
              { dataReady &&
                <Diagram
                  innerRef={(node) => {
                    if (!this.state.diagram) {
                      this.setState({ diagram: node });
                    }
                  }}
                >
                  { this.renderPathsSVG(this.state.viewport < VIEWPORTS.MEDIUM) }
                  { this.state.viewport && this.state.viewport < VIEWPORTS.MEDIUM && // VERTICAL
                    <div>
                      <DiagramSectionVertical>
                        { ENABLE_SDGS &&
                          <DiagramSectionVerticalHalf>
                            {this.renderRecommendationsButton()}
                          </DiagramSectionVerticalHalf>
                        }
                        { !ENABLE_SDGS &&
                          <DiagramSectionVerticalCenter>
                            {this.renderRecommendationsButton()}
                          </DiagramSectionVerticalCenter>
                        }
                        { ENABLE_SDGS &&
                          <DiagramSectionVerticalHalf>
                            {this.renderSdgtargetButton()}
                          </DiagramSectionVerticalHalf>
                        }
                      </DiagramSectionVertical>
                      <AnnotationVertical hasSDGs={ENABLE_SDGS}>
                        <FormattedMessage {...messages.diagram.addressed} />
                      </AnnotationVertical>
                      <DiagramSectionVertical>
                        <DiagramSectionVerticalCenter>
                          {this.renderMeasuresButton()}
                        </DiagramSectionVerticalCenter>
                      </DiagramSectionVertical>
                      <AnnotationVertical>
                        <FormattedMessage {...messages.diagram.measured} />
                      </AnnotationVertical>
                      <DiagramSectionVertical>
                        <DiagramSectionVerticalCenter>
                          {this.renderIndicatorButton()}
                        </DiagramSectionVerticalCenter>
                      </DiagramSectionVertical>
                    </div>
                  }
                  { this.state.viewport >= VIEWPORTS.MEDIUM && // HORIZONTAL
                    <div>
                      <DiagramSectionHorizontalHalf>
                        { ENABLE_SDGS &&
                          <DiagramSectionHorizontalTop>
                            {this.renderRecommendationsButton()}
                          </DiagramSectionHorizontalTop>
                        }
                        { !ENABLE_SDGS &&
                          <DiagramSectionHorizontalVCenter>
                            {this.renderRecommendationsButton()}
                          </DiagramSectionHorizontalVCenter>
                        }
                        { ENABLE_SDGS &&
                          <DiagramSectionHorizontalBottom>
                            {this.renderSdgtargetButton()}
                          </DiagramSectionHorizontalBottom>
                        }
                      </DiagramSectionHorizontalHalf>
                      <Annotation hasSDGs={ENABLE_SDGS}>
                        <FormattedMessage {...messages.diagram.addressed} />
                      </Annotation>
                      <DiagramSectionHorizontalCenter>
                        <DiagramSectionHorizontalVCenter>
                          {
                            this.renderMeasuresButton()
                          }
                        </DiagramSectionHorizontalVCenter>
                      </DiagramSectionHorizontalCenter>
                      <AnnotationMeasured>
                        <FormattedMessage {...messages.diagram.measured} />
                      </AnnotationMeasured>
                      <DiagramSectionHorizontalHalf>
                        <DiagramSectionHorizontalVCenter>
                          {this.renderIndicatorButton()}
                        </DiagramSectionHorizontalVCenter>
                      </DiagramSectionHorizontalHalf>
                    </div>
                  }
                </Diagram>
              }
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}

Overview.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func,
  onTaxonomyLink: PropTypes.func,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  recommendationCount: PropTypes.number,
  measureCount: PropTypes.number,
  sdgtargetCount: PropTypes.number,
  indicatorCount: PropTypes.number,
  recommendationDraftCount: PropTypes.number,
  measureDraftCount: PropTypes.number,
  sdgtargetDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
  theme: PropTypes.object,
};

Overview.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectTaxonomiesSorted(state),
  recommendationCount: selectRecommendationCount(state),
  measureCount: selectMeasureCount(state),
  sdgtargetCount: selectSdgtargetCount(state),
  indicatorCount: selectIndicatorCount(state),
  recommendationDraftCount: selectRecommendationDraftCount(state),
  measureDraftCount: selectMeasureDraftCount(state),
  sdgtargetDraftCount: selectSdgtargetDraftCount(state),
  indicatorDraftCount: selectIndicatorDraftCount(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
    onTaxonomyLink: (path) => {
      dispatch(updatePath(path, { keepQuery: true }));
    },
  };
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Overview));
