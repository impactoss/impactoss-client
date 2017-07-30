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

import styled from 'styled-components';

import { mapToTaxonomyList } from 'utils/taxonomies';

// containers
import { loadEntitiesIfNeeded, updatePath } from 'containers/App/actions';
import {
  selectEntities,
  selectReady,
} from 'containers/App/selectors';
import { CONTENT_LIST } from 'containers/App/constants';

// components
import Button from 'components/buttons/Button';
import ContainerWithSidebar from 'components/styled/Container/ContainerWithSidebar';
import Container from 'components/styled/Container';
import Icon from 'components/Icon';
import Sidebar from 'components/styled/Sidebar';
import Scrollable from 'components/styled/Scrollable';
import Loading from 'components/Loading';

import ContentHeader from 'components/ContentHeader';
import TaxonomySidebar from 'components/categoryList/TaxonomySidebar';

// relative
import messages from './messages';
import { DEPENDENCIES } from './constants';
import {
  selectRecommendationCount,
  selectIndicatorCount,
  selectMeasureCount,
  selectSdgtargetCount,
} from './selectors';

const Content = styled.div`
  padding: 0 4em;
`;
const Description = styled.p`
  margin-bottom: 2em;
  font-size: 1.25em;
`;
const Diagram = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 180px;
`;
const DiagramLeft = styled.div`
  display: inline-block;
  width: 30%;
  position: relative;
  height: 300px;
`;
const DiagramHCenter = styled.div`
  display: inline-block;
  width: 40%;
  position: relative;
  height: 300px;
`;
const DiagramRight = styled.div`
  display: inline-block;
  width: 30%;
  position: relative;
  height: 300px;
`;

const DiagramTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  width: 100%;
`;
const DiagramBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
`;
const DiagramVCenter = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translate(0, -50%);
`;
const Annotation = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  text-align: center;
  word-spacing: 1000000px;
  width: 200px;
  color: ${palette('dark', 4)};
  line-height: 1.1em;
  font-size: 0.9em;
  margin-top: -2em;
`;
const Addressed = styled(Annotation)`
  left: 33%;
`;
const Measured = styled(Annotation)`
  left: 69%;
`;
const Categorised = styled.div`
  position: absolute;
  top: 100%;
  border-top: 1px solid ${palette('light', 4)};
  width: 100%;
  -webkit-text-align: left;
  text-align: left;
  left: 0;
  padding-top: 5px;
  color: ${palette('dark', 4)};
  font-weight: normal;
  font-size: 0.85em;
`;

const CategorisedIcons = styled.div`
  padding-top: 5px;
`;
const CategorisedIcon = styled.span`
  padding: 0 5px;
`;

const DiagramButton = styled(Button)`
  color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 0)};
  }
  background-color: ${palette('primary', 4)};
  border-radius: 999px;
  padding: 0.8em 1em 1.2em;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  font-weight: bold;
  min-width: 180px;
`;
const DiagramButtonWrap = styled.div`
  position: relative;
  padding: 1em 0;
  display: inline-block;
`;
const DiagramButtonMain = styled(DiagramButton)`
  color: ${palette('primary', 4)};
  background-color: ${palette('primary', 1)};
  &:hover {
    color: ${palette('primary', 4)};
    background-color: ${palette('primary', 0)};
  }
  &:before {
    content:'';
    display:inline-block;
    vertical-align:middle;
    padding-top:100%;
  }
`;
const DiagramButtonMainInside = styled.span`
  display:inline-block;
  vertical-align:middle;
  margin-top: -30px;
`;
const Count = styled.span`
  padding-right: 5px;
`;
const DiagramButtonMainTop = styled.div`
  font-size: 1.5em;
`;
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
  stroke: ${palette('dark', 1)};
  stroke-width: 0.5px;
  fill: none;
`;
const PathLineArrow = styled(PathLine)`
  fill: ${palette('dark', 2)};
`;


export class Overview extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      diagram: null,
      buttonRecs: null,
      buttonMeasures: null,
      buttonIndicators: null,
      buttonSdgtargets: null,
    };
  }
  // make sure to load all data from server
  componentWillMount() {
    this.props.loadEntitiesIfNeeded();
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
    taxonomies.filter((tax) => tax.getIn(['attributes', tags]))

  getConnectionPoint = (node, nodeReference, side = 'right') => {
    const boundingRect = node.getBoundingClientRect();
    const boundingRectReference = nodeReference.getBoundingClientRect();
    return ({
      x: side === 'right'
        ? (boundingRect.right - boundingRectReference.left)
        : (boundingRect.left - boundingRectReference.left),
      y: (boundingRect.top - boundingRectReference.top)
        + (((boundingRect.bottom - boundingRectReference.top) - (boundingRect.top - boundingRectReference.top)) / 2),
    });
  }

  getConnectionPath = (start, end) =>
    [
      {
        x: start.x + 5,
        y: start.y,
      },
      {
        x: end.x - 5,
        y: end.y,
      },
    ];

  getCurvedConnectionPath = (start, end, curve = 0.25) =>
    [
      {
        x: start.x + 5,
        y: start.y,
      },
      {
        x: start.x + ((end.x - start.x) * curve),
        y: start.y,
      },
      {
        x: start.x + ((end.x - start.x) * curve),
        y: end.y,
      },
      {
        x: end.x - 5,
        y: end.y,
      },
    ];

  getConnectionPathArrow = (connectionPath) => {
    const point = connectionPath[connectionPath.length - 1];
    return [
      point,
      {
        x: point.x - 5,
        y: point.y - 5,
      },
      {
        x: point.x - 5,
        y: point.y + 5,
      },
      point,
    ];
  }

  resize = () => this.forceUpdate();

  renderTaxonomyIcons = (taxonomies) => (
    <CategorisedIcons>
      {
        taxonomies.toList().map((tax, i) =>
          (
            <CategorisedIcon key={i}>
              <Icon name={`taxonomy_${tax.get('id')}`} size="2em" />
            </CategorisedIcon>
          )
        )
      }
    </CategorisedIcons>
  )

  render() {
    const {
      taxonomies,
      dataReady,
      onPageLink,
      recommendationCount,
      sdgtargetCount,
      measureCount,
      indicatorCount,
    } = this.props;

    const connectRecommendationsMeasures = this.state.buttonRecs && this.state.buttonMeasures && this.state.diagram &&
      this.getCurvedConnectionPath(
        this.getConnectionPoint(this.state.buttonRecs, this.state.diagram, 'right'),
        this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'left'),
      );
    const connectSdgtargetsMeasures = this.state.buttonSdgtargets && this.state.buttonMeasures && this.state.diagram &&
      this.getCurvedConnectionPath(
        this.getConnectionPoint(this.state.buttonSdgtargets, this.state.diagram, 'right'),
        this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'left'),
      );
    const connectMeasuresIndicators = this.state.buttonIndicators && this.state.buttonMeasures && this.state.diagram &&
      this.getConnectionPath(
        this.getConnectionPoint(this.state.buttonMeasures, this.state.diagram, 'right'),
        this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, 'left'),
      );
    const connectSdgtargetsIndicators = this.state.buttonIndicators && this.state.buttonSdgtargets && this.state.diagram &&
      this.getCurvedConnectionPath(
        this.getConnectionPoint(this.state.buttonSdgtargets, this.state.diagram, 'right'),
        this.getConnectionPoint(this.state.buttonIndicators, this.state.diagram, 'left'),
        0.9
      );

    return (
      <div>
        <Helmet
          title={this.context.intl.formatMessage(messages.title)}
          meta={[
            { name: 'description', content: this.context.intl.formatMessage(messages.metaDescription) },
          ]}
        />
        <Sidebar>
          <Scrollable>
            <TaxonomySidebar
              taxonomies={mapToTaxonomyList(taxonomies, onPageLink)}
            />
          </Scrollable>
        </Sidebar>
        <ContainerWithSidebar>
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
                  <DiagramSvgWrapper>
                    { this.state.diagram &&
                      <svg
                        width={this.state.diagram.getBoundingClientRect().width}
                        height={this.state.diagram.getBoundingClientRect().height}
                      >
                        {connectSdgtargetsIndicators &&
                          <PathLineCustom
                            points={connectSdgtargetsIndicators}
                            strokeDasharray="5,5"
                            r={20}
                          />
                        }
                        {connectRecommendationsMeasures &&
                          <PathLineCustom
                            points={connectRecommendationsMeasures}
                            r={20}
                          />
                        }
                        {connectRecommendationsMeasures &&
                          <PathLineArrow
                            points={this.getConnectionPathArrow(connectRecommendationsMeasures)}
                            r={0}
                          />
                        }
                        {connectSdgtargetsMeasures &&
                          <PathLineCustom
                            points={connectSdgtargetsMeasures}
                            r={20}
                          />
                        }
                        {connectMeasuresIndicators &&
                          <PathLineCustom
                            points={connectMeasuresIndicators}
                            r={20}
                          />
                        }
                        {connectMeasuresIndicators &&
                          <PathLineArrow
                            points={this.getConnectionPathArrow(connectMeasuresIndicators)}
                            r={0}
                          />
                        }
                      </svg>
                    }
                  </DiagramSvgWrapper>
                  <DiagramLeft>
                    <DiagramTop>
                      <DiagramButtonWrap>
                        <DiagramButton
                          onClick={() => onPageLink('/recommendations')}
                          innerRef={(node) => {
                            if (!this.state.buttonRecs) {
                              this.setState({ buttonRecs: node });
                            }
                          }}
                        >
                          <div>
                            <Icon name="recommendations" />
                          </div>
                          <div>
                            <Count>{recommendationCount}</Count>
                            <FormattedMessage {...messages.buttons.recommendations} />
                          </div>
                        </DiagramButton>
                        <Categorised>
                          <FormattedMessage {...messages.diagram.categorised} />
                          {
                            this.renderTaxonomyIcons(this.getTaxonomiesByTagging(taxonomies, 'tags_recommendations'))
                          }
                        </Categorised>
                      </DiagramButtonWrap>
                    </DiagramTop>
                    <DiagramBottom>
                      <DiagramButtonWrap>
                        <DiagramButton
                          onClick={() => onPageLink('/sdgtargets')}
                          innerRef={(node) => {
                            if (!this.state.buttonSdgtargets) {
                              this.setState({ buttonSdgtargets: node });
                            }
                          }}
                        >
                          <div>
                            <Icon name="sdgtargets" />
                          </div>
                          <div>
                            <Count>{sdgtargetCount}</Count>
                            <FormattedMessage {...messages.buttons.sdgtargets} />
                          </div>
                        </DiagramButton>
                        <Categorised>
                          <FormattedMessage {...messages.diagram.categorised} />
                          {
                            this.renderTaxonomyIcons(this.getTaxonomiesByTagging(taxonomies, 'tags_sdgtargets'))
                          }
                        </Categorised>
                      </DiagramButtonWrap>
                    </DiagramBottom>
                  </DiagramLeft>
                  <Addressed>
                    <FormattedMessage {...messages.diagram.addressed} />
                  </Addressed>
                  <DiagramHCenter>
                    <DiagramVCenter>
                      <DiagramButtonWrap>
                        <DiagramButtonMain
                          onClick={() => onPageLink('/actions')}
                          innerRef={(node) => {
                            if (!this.state.buttonMeasures) {
                              this.setState({ buttonMeasures: node });
                            }
                          }}
                        >
                          <DiagramButtonMainInside>
                            <div>
                              <Icon name="measures" size="5em" />
                            </div>
                            <DiagramButtonMainTop>
                              <FormattedMessage {...messages.buttons.measures} />
                            </DiagramButtonMainTop>
                            <DiagramButtonMainBottom>
                              <Count>{measureCount}</Count>
                              <FormattedMessage {...messages.buttons.measuresAdditional} />
                            </DiagramButtonMainBottom>
                          </DiagramButtonMainInside>
                        </DiagramButtonMain>
                        <Categorised>
                          <FormattedMessage {...messages.diagram.categorised} />
                          {
                            this.renderTaxonomyIcons(this.getTaxonomiesByTagging(taxonomies, 'tags_measures'))
                          }
                        </Categorised>
                      </DiagramButtonWrap>
                    </DiagramVCenter>
                  </DiagramHCenter>
                  <Measured>
                    <FormattedMessage {...messages.diagram.measured} />
                  </Measured>
                  <DiagramRight>
                    <DiagramVCenter>
                      <DiagramButton
                        onClick={() => onPageLink('/indicators')}
                        innerRef={(node) => {
                          if (!this.state.buttonIndicators) {
                            this.setState({ buttonIndicators: node });
                          }
                        }}
                      >
                        <div>
                          <Icon name="indicators" />
                        </div>
                        <div>
                          <Count>{indicatorCount}</Count>
                          <FormattedMessage {...messages.buttons.indicators} />
                        </div>
                      </DiagramButton>
                    </DiagramVCenter>
                  </DiagramRight>
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
  taxonomies: PropTypes.object,
  dataReady: PropTypes.bool,
  recommendationCount: PropTypes.number,
  measureCount: PropTypes.number,
  sdgtargetCount: PropTypes.number,
  indicatorCount: PropTypes.number,
};

Overview.contextTypes = {
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dataReady: selectReady(state, { path: DEPENDENCIES }),
  taxonomies: selectEntities(state, 'taxonomies'),
  recommendationCount: selectRecommendationCount(state),
  measureCount: selectMeasureCount(state),
  sdgtargetCount: selectSdgtargetCount(state),
  indicatorCount: selectIndicatorCount(state),
});

function mapDispatchToProps(dispatch) {
  return {
    loadEntitiesIfNeeded: () => {
      DEPENDENCIES.forEach((path) => dispatch(loadEntitiesIfNeeded(path)));
    },
    onPageLink: (path) => {
      dispatch(updatePath(path));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
