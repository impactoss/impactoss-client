// import React, { useContext } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { palette } from 'styled-theme';

// import { isMinSize } from 'utils/responsive';

import {
  Box, Text, Button, // ResponsiveContext,
} from 'grommet';

import ButtonHero from 'components/buttons/ButtonHero';
import Icon from 'components/Icon';

const ExploreText = styled((p) => <Text weight="bold" {...p} />)``;

const Styled = styled((p) => (<Box responsive={false} {...p} />))``;
const CardWrapper = styled((p) => <Box {...p} />)``;
const CardLink = styled((p) => <Button plain as="a" fill="vertical" {...p} />)`
  border-radius: 20px;
  padding: ${({ isHome }) => isHome ? '20px' : '20px 20px 10px'};
  padding-top: ${({ hasIcon }) => hasIcon ? 0 : 20}px;
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
const TitleWrap = styled((p) => <Box align="center" {...p} />)`
  color: ${({ colors }) => colors ? colors[0] : 'auto'};
`;
const Title = styled((p) => <Text {...p} />)``;
const Description = styled((p) => <Text {...p} />)``;
const ExploreButton = styled(ButtonHero)`
  background-color: ${({ colors }) => colors ? colors[0] : 'auto'};
  min-width: auto;
  &:hover, &:focus-visible {
    background-color: ${({ colors }) => colors ? colors[1] : 'auto'};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    min-width: auto;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    min-width: auto;
  }
`;

const IconAnchor = styled.div`
  position: relative;
  height: 66px;
`;
const IconWrap = styled.div`
  border-radius: 999px;
  background-color: ${({ color }) => color || 'auto'};
  position: absolute;
  left: 50%;
  transform: translate(-50%, -36%);
  padding: 10px;
`;

export function CardTeaser({
  onClick,
  path,
  title,
  description,
  graphic,
  icon,
  isHome,
  explore,
  basis = '1/2',
  colors,
}) {
  // const size = useContext(ResponsiveContext);
  return (
    <Styled basis={basis}>
      <CardWrapper fill={isHome && 'vertical'}>
        <CardLink
          href={`${path}`}
          onClick={onClick}
          isHome={isHome}
          hasIcon={!!icon}
        >
          {icon && (
            <IconAnchor align="center">
              <IconWrap
                color={colors && colors[0]}
              >
                <Icon
                  name={icon}
                  size="60px"
                  color="white"
                />
              </IconWrap>
            </IconAnchor>
          )}
          <Box fill={isHome && 'vertical'}>
            {graphic && (
              <Box style={{ minHeight: '150px' }}>
                TODO: card graphic
              </Box>
            )}
            <Box
              fill="vertical"
              justify="between"
              align="center"
            >
              <Box gap="small">
                <TitleWrap
                  gap="none"
                  flex={{ shrink: 0 }}
                  colors={colors}
                >
                  <Title
                    size={isHome ? 'xlarge' : 'large'}
                    weight={isHome ? '400' : '600'}
                  >
                    {title}
                  </Title>
                </TitleWrap>
                {description && (
                  <Description>
                    {description}
                  </Description>
                )}
              </Box>
              {explore && (
                <Box
                  margin={{ top: 'medium', bottom: 'small' }}
                  pad="none"
                  align="center"
                >
                  <ExploreButton as="div" colors={colors}>
                    <ExploreText>{explore}</ExploreText>
                  </ExploreButton>
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
  colors: PropTypes.array,
  description: PropTypes.string,
  explore: PropTypes.string,
  graphic: PropTypes.string,
  basis: PropTypes.string,
  icon: PropTypes.string,
  isHome: PropTypes.bool,
  // teaserImage: PropTypes.string,
};

export default CardTeaser;
