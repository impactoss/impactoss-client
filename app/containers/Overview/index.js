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

import { qe } from 'utils/quasi-equals';
import isNumber from 'utils/is-number';

// relative
import appMessages from 'containers/App/messages';
import messages from './messages';
import { DEPENDENCIES } from './constants';
import {
  selectRecommendationCount,
  selectIndicatorCount,
  selectMeasureCount,
  selectRecommendationDraftCount,
  selectIndicatorDraftCount,
  selectMeasureDraftCount,
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
  margin: 30px 20px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

const DiagramButton = styled(Button)`
  background-color: ${palette('primary', 4)};
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
  }
  padding: ${({ draft }) => draft ? '0.4em 0.5em 0.75em' : '0.6em 0.5em'};
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  font-size: 0.8em;
  border-radius: 10px;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    border-radius: 999px;
    font-weight: bold;
    font-size: 1.1em;
    padding: ${({ draft }) => draft ? '0.4em 0.5em 1em' : '0.6em 0.5em'};
    min-width: 220px;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    padding: ${({ draft }) => draft ? '0.6em 1em 1.4em' : '0.8em 1em'};
  }
`;
// font-size: ${(props) => props.theme.sizes.text.aaLargeBold};
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
const SectionLabel = styled.div`
  color: ${palette('text', 1)};
  font-size: 13px;
  margin-top: 5px;
  position: absolute;
  left: 0;
  top: 0;
`;

const STATE_INITIAL = {
  diagram: null,
  buttonRecs_1: null,
  buttonRecs_2: null,
  buttonRecs_3: null,
  buttonRecs_4: null,
  buttonRecs_5: null,
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
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getTaxonomiesByTagging = (taxonomies, tags) => taxonomies.filter((tax, key, list) => {
    if (tax.getIn(['attributes', tags])) {
      return true;
    }
    const childTaxonomies = list.filter((item) => qe(item.getIn(['attributes', 'parent_id']), tax.get('id')));
    return childTaxonomies.some((child) => child.getIn(['attributes', tags]));
  })

  getConnectionPoint = (node, nodeReference, side = 'bottom') => {
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

  getConnectionPath = (start, end) => [
    { x: start.x, y: start.y + 5 },
    { x: end.x, y: end.y - 5 },
  ];

  getCurvedConnectionPath = (around = false, start, end, curve = 0.2) => around
    ? [
      { x: start.x + 5, y: start.y },
      { x: (start.x + 5) + ((end.x - start.x - 10) * curve), y: start.y },
      { x: (start.x + 5) + ((end.x - start.x - 10) * curve), y: end.y },
      { x: end.x - 5, y: end.y },
    ]
    : [
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

  connectRecommendationsMeasures = (fwId) => this.getCurvedConnectionPath(
    false,
    this.getConnectionPoint(this.state[`buttonRecs_${fwId}`], this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'top'),
    0.5,
  );

  connectRecommendationsIndicators = (fwId) => this.getCurvedConnectionPath(
    false,
    this.getConnectionPoint(this.state[`buttonRecs_${fwId}`], this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, 'top'),
    0.83, // curve
  );

  connectMeasuresIndicators = () => this.getConnectionPath(
    this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'bottom'),
    this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, 'top'),
  );

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.updateViewport();
    this.forceUpdate();
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

  renderPathsSVG = (frameworks) => (
    <DiagramSvgWrapper>
      { this.state.diagram
        && (
          <svg
            width={this.state.diagram.getBoundingClientRect().width}
            height={this.state.diagram.getBoundingClientRect().height}
          >
            { frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return fw.getIn(['attributes', 'has_indicators'])
              && this.state[`buttonRecs_${fwId}`]
              && this.state.buttonIndicators && (
                <PathLineCustom
                  points={this.connectRecommendationsIndicators(fwId)}
                  strokeDasharray="5,5"
                  r={33}
                  key={fwId}
                />
              );
            })}
            { frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return this.state[`buttonRecs_${fwId}`]
              && this.state.buttonMeasures && (
                <PathLineCustom
                  points={this.connectRecommendationsMeasures(fwId)}
                  r={33}
                  key={fwId}
                />
              );
            })}
            { frameworks && frameworks.valueSeq().map((fw) => {
              const fwId = fw.get('id');
              return fw.getIn(['attributes', 'has_measures'])
              && this.state[`buttonRecs_${fwId}`]
              && this.state.buttonMeasures && (
                <PathLineArrow
                  points={
                    this.getConnectionPathArrow(
                      this.connectRecommendationsMeasures(fwId)
                    )
                  }
                  r={0}
                  key={fwId}
                />
              );
            })}
            { this.state.buttonIndicators && this.state.buttonMeasures && (
              <PathLineCustom
                points={this.connectMeasuresIndicators()}
                r={33}
              />
            )}
            { this.state.buttonIndicators && this.state.buttonMeasures && (
              <PathLineArrow
                points={
                  this.getConnectionPathArrow(
                    this.connectMeasuresIndicators()
                  )
                }
                r={0}
              />
            )}
          </svg>
        )
      }
    </DiagramSvgWrapper>
  );

  renderButton = ({
    path,
    query,
    paletteDefault,
    paletteHover,
    icon,
    type,
    count,
    draftCount,
    stateButton,
  }) => {
    const { intl } = this.context;
    return (
      <DiagramButton
        onClick={() => this.props.onPageLink(path, query)}
        paletteDefault={paletteDefault}
        paletteHover={paletteHover}
        ref={(node) => {
          if (!this.state[stateButton]) {
            this.setState({ [stateButton]: node });
          }
        }}
        draft={draftCount > 0}
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
        { draftCount > 0
          && (
            <DraftEntities>
              <FormattedMessage {...messages.buttons.draft} values={{ count: draftCount }} />
            </DraftEntities>
          )
        }
      </DiagramButton>
    );
  };

  render() {
    const { intl } = this.context;
    const {
      dataReady,
      onTaxonomyLink,
      taxonomies,
      frameworks,
      frameworkId,
    } = this.props;

    return (
      <div>
        <Helmet
          title={intl.formatMessage(messages.title)}
          meta={[
            { name: 'description', content: intl.formatMessage(messages.metaDescription) },
          ]}
        />
        { !dataReady
          && <EntityListSidebarLoading responsiveSmall />
        }
        { dataReady
          && (
            <TaxonomySidebar
              taxonomies={taxonomies}
              frameworkId={frameworkId}
              frameworks={frameworks}
              onTaxonomyLink={onTaxonomyLink}
            />
          )
        }
        <ContainerWithSidebar sidebarResponsiveSmall>
          <Container>
            <Content>
              <ContentHeader
                type={CONTENT_LIST}
                supTitle={intl.formatMessage(messages.supTitle)}
                title={intl.formatMessage(messages.title)}
              />
              <Description>
                <FormattedMessage {...messages.description} />
              </Description>
              { !dataReady
                && <Loading />
              }
              { dataReady
                && (
                  <Diagram
                    ref={(node) => {
                      if (!this.state.diagram) {
                        this.setState({ diagram: node });
                      }
                    }}
                  >
                    { this.renderPathsSVG(frameworks) }
                    <div>
                      <DiagramSectionVertical>
                        <SectionLabel>
                          <FormattedMessage {...appMessages.nav.recommendationsSuper} />
                        </SectionLabel>
                        <DiagramSectionVerticalCenter>
                          {frameworks
                          && frameworks.valueSeq().map((fw) => {
                            const fwId = isNumber(fw.get('id')) ? parseInt(fw.get('id'), 10) : fw.get('id');
                            return (
                              <DiagramButtonWrap key={fwId}>
                                {this.renderButton({
                                  path: PATHS.RECOMMENDATIONS,
                                  query: frameworks.size > 1 && {
                                    arg: 'fwx',
                                    value: fwId,
                                    replace: true,
                                  },
                                  paletteDefault: 'recommendations',
                                  paletteHover: 'recommendationsHover',
                                  stateButton: `buttonRecs_${fwId}`,
                                  icon: `recommendations_${fwId}`,
                                  type: `recommendations_${fwId}`,
                                  count: this.props.recommendationCountByFw.get(fwId),
                                  draftCount: this.props.recommendationDraftCountByFw.get(fwId),
                                })}
                              </DiagramButtonWrap>
                            );
                          })
                          }
                        </DiagramSectionVerticalCenter>
                      </DiagramSectionVertical>
                      <DiagramSectionVertical>
                        <SectionLabel>
                          <FormattedMessage {...appMessages.nav.measuresSuper} />
                        </SectionLabel>
                        <DiagramSectionVerticalCenter>
                          <DiagramButtonWrap>
                            {this.renderButton({
                              path: PATHS.MEASURES,
                              paletteDefault: 'measures',
                              paletteHover: 'measuresHover',
                              stateButton: 'buttonMeasures',
                              icon: 'measures',
                              type: 'measures',
                              count: this.props.measureCount,
                              draftCount: this.props.measureDraftCount,
                            })}
                          </DiagramButtonWrap>
                        </DiagramSectionVerticalCenter>
                      </DiagramSectionVertical>
                      <DiagramSectionVertical>
                        <SectionLabel>
                          <FormattedMessage {...appMessages.nav.indicatorsSuper} />
                        </SectionLabel>
                        <DiagramSectionVerticalCenter>
                          <DiagramButtonWrap>
                            {this.renderButton({
                              path: PATHS.INDICATORS,
                              paletteDefault: 'indicators',
                              paletteHover: 'indicatorsHover',
                              stateButton: 'buttonIndicators',
                              icon: 'indicators',
                              type: 'indicators',
                              count: this.props.indicatorCount,
                              draftCount: this.props.indicatorDraftCount,
                            })}
                          </DiagramButtonWrap>
                        </DiagramSectionVerticalCenter>
                      </DiagramSectionVertical>
                    </div>
                  </Diagram>
                )
              }
            </Content>
          </Container>
        </ContainerWithSidebar>
      </div>
    );
  }
}
// <AnnotationVertical>
//   {`${recommendationAddressedCount} ${intl.formatMessage(messages.diagram.addressed)}`}
// </AnnotationVertical>
// <AnnotationVertical>
//   <FormattedMessage {...messages.diagram.measured} />
// </AnnotationVertical>

Overview.propTypes = {
  loadEntitiesIfNeeded: PropTypes.func,
  onPageLink: PropTypes.func,
  onTaxonomyLink: PropTypes.func,
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  recommendationCountByFw: PropTypes.object,
  measureCount: PropTypes.number,
  indicatorCount: PropTypes.number,
  recommendationDraftCountByFw: PropTypes.object,
  measureDraftCount: PropTypes.number,
  indicatorDraftCount: PropTypes.number,
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
  recommendationCountByFw: selectRecommendationCount(state),
  measureCount: selectMeasureCount(state),
  indicatorCount: selectIndicatorCount(state),
  recommendationDraftCountByFw: selectRecommendationDraftCount(state),
  measureDraftCount: selectMeasureDraftCount(state),
  indicatorDraftCount: selectIndicatorDraftCount(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path, query) => {
      dispatch(updatePath(
        path,
        {
          query,
        }
      ));
    },
    onTaxonomyLink: (path) => {
      dispatch(updatePath(path, { keepQuery: true }));
    },
  };
}

export default withTheme(connect(mapStateToProps, mapDispatchToProps)(Overview));
