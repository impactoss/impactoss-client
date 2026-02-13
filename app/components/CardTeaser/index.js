import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

// import { isMinSize } from 'utils/responsive';

import {
  Box, Text, Button, // ResponsiveContext,
} from 'grommet';

import ButtonHero from 'components/buttons/ButtonHero';

const ExploreText = styled((p) => <Text weight="bold" {...p} />)``;

const Styled = styled((p) => (
  <Box pad="small" responsive={false} {...p} />
))``;
const CardWrapper = styled((p) => <Box {...p} />)`
  width:100%;
  height: 100%;
`;
const CardLink = styled((p) => <Button plain as="a" fill="vertical" {...p} />)`
  border-radius: 10px;
  padding: 25px;
  min-height: ${({ isPrimary }) => isPrimary ? 180 : 0}px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.20);
  color: ${palette('dark', 0)};
  background: white;
  &:hover, &:focus-visible {
    box-shadow: 0px 2px 8px rgba(0,0,0,0.33);
    color: ${palette('dark', 0)};
  }
  &:focus-visible {
    outline: 2px solid ${palette('primary', 0)};
    border-radius: 10px;
    box-shadow: none;
  }
`;
const TitleWrap = styled((p) => <Box {...p} />)``;
const Title = styled((p) => <Text {...p} />)``;
const Description = styled((p) => <Text {...p} />)``;

export function CardTeaser({
  onClick,
  path,
  title,
  description,
  graphic,
  isHome,
  explore,
  basis = '1/2',
}) {
  // const size = useContext(ResponsiveContext);

  return (
    <Styled basis={basis}>
      <CardWrapper fill="vertical">
        <CardLink
          href={`${path}`}
          onClick={onClick}
        >
          <Box fill="vertical">
            {graphic && (
              <Box
                fill={isHome ? 'vertical' : 'horizontal'}
                justify={isHome ? 'end' : 'start'}
              >
                Awesome graphic
              </Box>
            )}
            <Box
              margin={graphic && !isHome ? 'none' : { top: 'small' }}
              justify={isHome ? 'start' : 'end'}
              flex={{ shrink: 0 }}
              align="center"
            >
              <TitleWrap
                gap="none"
                margin={{ bottom: 'small' }}
                flex={{ shrink: 0 }}
              >
                <Title size="xlarge">
                  {title}
                </Title>
              </TitleWrap>
              {description && (
                <Description>
                  {description}
                </Description>
              )}
              {explore && (
                <Box
                  margin={{ top: 'medium', bottom: 'small' }}
                  pad="none"
                  align="center"
                  gap="xsmall"
                  flex={{ shrink: 0 }}
                >
                  <ButtonHero as="div">
                    <ExploreText>{explore}</ExploreText>
                  </ButtonHero>
                </Box>
              )}
            </Box>
          </Box>
        </CardLink>
      </CardWrapper>
    </Styled>
  );
}

CardTeaser.propTypes = {
  path: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  explore: PropTypes.string,
  graphic: PropTypes.string,
  basis: PropTypes.string,
  isHome: PropTypes.bool,
  // teaserImage: PropTypes.string,
};

export default CardTeaser;
