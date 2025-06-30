/*
 *
 * Overview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { PathLine } from 'react-svg-pathline';
import { palette } from 'styled-theme';

import styled from 'styled-components';

const RADIUS = 6;

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

const roundRect = (rect) => ({
  right: Math.floor(rect.right),
  left: Math.floor(rect.left),
  top: Math.floor(rect.top),
  bottom: Math.floor(rect.bottom),
})

const getConnectionPoint = (node, nodeReference, side = 'bottom') => {
  const boundingRect = roundRect(node.getBoundingClientRect());
  const boundingRectReference = roundRect(nodeReference.getBoundingClientRect());
  if (side === 'right' || side === 'left') {
    return ({
      x: side === 'right'
        ? (boundingRect.right - boundingRectReference.left)
        : (boundingRect.left - boundingRectReference.left),
      y: (boundingRect.top - boundingRectReference.top)
        + (((boundingRect.bottom - boundingRectReference.top) - (boundingRect.top - boundingRectReference.top)) / 2),
    });
  }

  const ret = ({
    x: (boundingRect.left - boundingRectReference.left)
      + (((boundingRect.right - boundingRectReference.left) - (boundingRect.left - boundingRectReference.left)) / 2),
    y: side === 'bottom'
      ? (boundingRect.bottom - boundingRectReference.top)
      : (boundingRect.top - boundingRectReference.top),
  });
  return ret;
};

const getConnectionPath = (start, end) => [
  { x: start.x, y: start.y + 5 },
  { x: end.x, y: end.y - 5 },
];

const getCurvedConnectionPath = (
  direction = 'vertical',
  start,
  end,
  curve = 0.2,
  offset,
) => {
  if (direction === 'right') {
    return [
      { x: start.x + 5, y: start.y },
      { x: Math.max(start.x, end.x) + 25, y: start.y },
      { x: Math.max(start.x, end.x) + 25, y: end.y },
      { x: end.x + 5, y: end.y },
    ];
  }
  if (offset) {
    return [
      { x: start.x + 12, y: start.y + 5 },
      { x: start.x + 12, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
      { x: end.x, y: end.y - 5 },
    ];
  }
  if (Math.abs(start.x - end.x) < RADIUS * 2) {
    return getConnectionPath(
      {...start, x: end.x},
      end,
    );
  }
  return [
    { x: start.x, y: start.y + 5 },
    { x: start.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
    { x: end.x, y: (start.y + 5) + ((end.y - start.y - 10) * curve) },
    { x: end.x, y: end.y - 5 },
  ];
};

const getConnectionPathArrow = (connectionPath, direction = 'bottom') => {
  const point = connectionPath[connectionPath.length - 1];
  if (direction === 'left') {
    return [
      point,
      { x: point.x + 5, y: point.y + 5 },
      { x: point.x + 5, y: point.y - 5 },
      point,
    ];
  }
  return [
    point,
    { x: point.x - 5, y: point.y - 5 },
    { x: point.x + 5, y: point.y - 5 },
    point,
  ];
};

const connectRecommendationsMeasures = (itemRefs, fwId) => getCurvedConnectionPath(
  'vertical',
  getConnectionPoint(itemRefs[`buttonRecs_${fwId}`], itemRefs.diagram, 'bottom'),
  getConnectionPoint(itemRefs.buttonMeasures, itemRefs.diagram, 'top'),
  0.25,
);

const connectRecommendationsIndicators = (
  itemRefs,
  direction = 'vertical',
  fwId,
  offset,
) => getCurvedConnectionPath(
  direction,
  getConnectionPoint(
    itemRefs[`buttonRecs_${fwId}`],
    itemRefs.diagram,
    direction === 'vertical' ? 'bottom' : direction,
  ),
  getConnectionPoint(
    itemRefs.buttonIndicators,
    itemRefs.diagram,
    direction === 'vertical' ? 'top' : direction,
  ),
  0.9, // curve
  offset,
);

const connectMeasuresIndicators = (itemRefs) => getConnectionPath(
  getConnectionPoint(itemRefs.buttonMeasures, itemRefs.diagram, 'bottom'),
  getConnectionPoint(itemRefs.buttonIndicators, itemRefs.diagram, 'top'),
);

const VerticalDiagramSVG = ({ frameworks, itemRefs, version }) => {
  return (
    <DiagramSvgWrapper>
      {itemRefs.diagram && (
        <DiagramSvg
          width={itemRefs.diagram.getBoundingClientRect().width}
          height={itemRefs.diagram.getBoundingClientRect().height}
        >
          {frameworks && frameworks.valueSeq().map((fw) => {
            const fwId = fw.get('id');
            return fw.getIn(['attributes', 'has_indicators'])
              && itemRefs[`buttonRecs_${fwId}`]
              && itemRefs.buttonIndicators
              && (
                <PathLineCustom
                  key={fwId}
                  r={RADIUS}
                  strokeDasharray="5,5"
                  points={connectRecommendationsIndicators(
                    itemRefs,
                    frameworks.size === 1 ? 'right' : 'vertical',
                    fwId,
                    true, // offset
                  )}
                />
              );
          })}
          {frameworks && frameworks.valueSeq().map((fw) => {
            const fwId = fw.get('id');
            return fw.getIn(['attributes', 'has_indicators'])
              && itemRefs[`buttonRecs_${fwId}`]
              && itemRefs.buttonIndicators
              && frameworks.size === 1
              && (
                <PathLineArrow
                  key={fwId}
                  r={0}
                  points={
                    getConnectionPathArrow(
                      connectRecommendationsIndicators(
                        itemRefs,
                        'right',
                        fwId,
                      ),
                      'left'
                    )
                  }
                />
              );
          })}
          {frameworks && frameworks.valueSeq().map((fw) => {
            const fwId = fw.get('id');
            return itemRefs[`buttonRecs_${fwId}`]
              && itemRefs.buttonMeasures
              && (
                <PathLineCustom
                  key={fwId}
                  r={frameworks.size > 1 ? RADIUS : 0}
                  points={connectRecommendationsMeasures(itemRefs, fwId)}
                />
              );
          })}
          {frameworks && frameworks.valueSeq().map((fw) => {
            const fwId = fw.get('id');
            return fw.getIn(['attributes', 'has_measures'])
              && itemRefs[`buttonRecs_${fwId}`]
              && itemRefs.buttonMeasures
              && (
                <PathLineArrow
                  key={fwId}
                  r={0}
                  points={
                    getConnectionPathArrow(
                      connectRecommendationsMeasures(itemRefs, fwId)
                    )
                  }
                />
              );
          })}
          { itemRefs.buttonIndicators && itemRefs.buttonMeasures && (
            <PathLineCustom
              r={0}
              points={connectMeasuresIndicators(itemRefs)}
            />
          )}
          { itemRefs.buttonIndicators && itemRefs.buttonMeasures && (
            <PathLineArrow
              r={0}
              points={
                getConnectionPathArrow(
                  connectMeasuresIndicators(itemRefs)
                )
              }
            />
          )}
        </DiagramSvg>
      )}
    </DiagramSvgWrapper>
  );
};

VerticalDiagramSVG.propTypes = {
  frameworks: PropTypes.object,
  itemRefs: PropTypes.object,
  version: PropTypes.number,
};

export default VerticalDiagramSVG;
