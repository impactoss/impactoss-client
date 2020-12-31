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

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectFWTaxonomiesSorted,
  selectReady,
  selectActiveFrameworks,
  selectFrameworkQuery,
} from 'containers/App/selectors';
import { PATHS, CONTENT_LIST, VIEWPORTS } from 'containers/App/constants';

// components
import Button from 'components/buttons/Button';
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Icon from 'components/Icon';
import Loading from 'components/Loading';

import ContentHeader from 'components/ContentHeader';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';
import EntityListSidebarLoading from 'components/EntityListSidebarLoading';

import { attributesEqual } from 'utils/entities';

// relative
import messages from './messages';
import { DEPENDENCIES } from './constants';
import {
  selectRecommendationCount,
  selectIndicatorCount,
  selectMeasureCount,
  selectRecommendationDraftCount,
  selectIndicatorDraftCount,
  selectMeasureDraftCount,
  selectRecommendationAddressedCount,
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

const DiagramSectionVertical = styled.div`
  display: block;
  position: relative;
  text-align: center;
`;

const DiagramSectionVerticalCenter = styled.div`
  display: block;
  margin: 0 auto;
  position: relative;
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

  getTaxonomiesByTagging = (taxonomies, tags) =>
    taxonomies.filter((tax, key, list) => {
      if (tax.getIn(['attributes', tags])) {
        return true;
      }
      const childTaxonomies = list.filter((item) => attributesEqual(item.getIn(['attributes', 'parent_id']), tax.get('id')));
      return childTaxonomies.some((child) => child.getIn(['attributes', tags]));
    })

  getConnectionPoint = (node, nodeReference, side = 'bottom') => {
    const boundingRect = node.getBoundingClientRect();
    const boundingRectReference = nodeReference.getBoundingClientRect();

    return ({
      x: (boundingRect.left - boundingRectReference.left)
        + (((boundingRect.right - boundingRectReference.left) - (boundingRect.left - boundingRectReference.left)) / 2),
      y: side === 'bottom'
        ? (boundingRect.bottom - boundingRectReference.top)
        : (boundingRect.top - boundingRectReference.top),
    });
  }

  getConnectionPath = (start, end) => [
    { x: start.x, y: start.y + 5 },
    { x: end.x, y: end.y - 5 },
  ];

  getCurvedConnectionPath = (start, end, curve = 0.2) => [
    { x: start.x, y: start.y + 5 },
    { x: start.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
    { x: end.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
    { x: end.x, y: end.y - 5 },
  ];

  getConnectionPathArrow = (connectionPath) => {
    const point = connectionPath[connectionPath.length - 1];
    return [
      point,
      { x: point.x - 5, y: point.y - 5 },
      { x: point.x + 5, y: point.y - 5 },
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
  connectRecommendationsMeasures = () =>
    this.getConnectionPath(
      this.getConnectionPoint(this.state.buttonRecs, this.state.diagram, 'bottom'),
      this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'top'),
    );
  connectMeasuresIndicators = () => this.getConnectionPath(
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, 'top'),
    0.6
  );

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
  };

  renderPath = (points = [], dashed = false, r = 10) => (
    <PathLineCustom
      points={points}
      strokeDasharray={dashed ? '5,5' : null}
      r={r}
    />
  );
  renderArrow = (points = []) => (
    <PathLineArrow
      points={this.getConnectionPathArrow(points)}
      r={0}
    />
  );
  renderPathsSVG = () => (
    <DiagramSvgWrapper>
      { this.state.diagram &&
        <svg
          width={this.state.diagram.getBoundingClientRect().width}
          height={this.state.diagram.getBoundingClientRect().height}
        >
          { this.state.buttonRecs && this.state.buttonMeasures &&
            this.renderPath(this.connectRecommendationsMeasures())
          }
          { this.state.buttonRecs && this.state.buttonMeasures &&
            this.renderArrow(this.connectRecommendationsMeasures())
          }
          { this.state.buttonIndicators && this.state.buttonMeasures &&
            this.renderPath(this.connectMeasuresIndicators())
          }
          { this.state.buttonIndicators && this.state.buttonMeasures &&
            this.renderArrow(this.connectMeasuresIndicators())
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
  render() {
    const {
      dataReady,
      onTaxonomyLink,
      taxonomies,
      recommendationAddressedCount,
      frameworks,
      frameworkId,
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
            taxonomies={taxonomies}
            frameworkId={frameworkId}
            frameworks={frameworks}
            onTaxonomyLink={onTaxonomyLink}
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
                  { this.renderPathsSVG() }
                  <div>
                    <DiagramSectionVertical>
                      <DiagramSectionVerticalCenter>
                        {this.renderRecommendationsButton()}
                      </DiagramSectionVerticalCenter>
                    </DiagramSectionVertical>
                    <AnnotationVertical>
                      {`${recommendationAddressedCount} ${this.context.intl.formatMessage(messages.diagram.addressed)}`}
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
  indicatorCount: PropTypes.number,
  recommendationDraftCount: PropTypes.number,
  measureDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
  recommendationAddressedCount: PropTypes.number,
  theme: PropTypes.object,
  frameworks: PropTypes.object,
  frameworkId: PropTypes.string,
};

Overview.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectFWTaxonomiesSorted(state),
  frameworks: selectActiveFrameworks(state),
  frameworkId: selectFrameworkQuery(state),
  recommendationCount: selectRecommendationCount(state),
  measureCount: selectMeasureCount(state),
  indicatorCount: selectIndicatorCount(state),
  recommendationDraftCount: selectRecommendationDraftCount(state),
  measureDraftCount: selectMeasureDraftCount(state),
  indicatorDraftCount: selectIndicatorDraftCount(state),
  recommendationAddressedCount: selectRecommendationAddressedCount(state),
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
