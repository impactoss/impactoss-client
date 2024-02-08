/*
 *
 * EntityListDownload
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { palette } from 'styled-theme';
import DebounceInput from 'react-debounce-input';
import { snakeCase } from 'lodash/string';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import CsvDownloader from 'react-csv-downloader';

import {
  Box,
  Text,
  ResponsiveContext,
} from 'grommet';

import appMessages from 'containers/App/messages';
import { CONTENT_MODAL } from 'containers/App/constants';

import Content from 'components/Content';
import ContentHeader from 'components/ContentHeader';
import ButtonForm from 'components/buttons/ButtonForm';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import { filterEntitiesByKeywords } from 'utils/entities';
import { isMinSize } from 'utils/responsive';

import OptionsForRecommendations from './OptionsForRecommendations';
import OptionsForActions from './OptionsForActions';
import OptionsForIndicators from './OptionsForIndicators';

import messages from './messages';
import {
  prepareDataForIndicators,
  prepareDataForMeasures,
  prepareDataForRecommendations,
  getAttributes,
  getDateSuffix,
  getIndicatorColumns,
  // getDefaultEntityTypes,
} from './utils';

const Footer = styled.div`
  width: 100%;
`;

// color: white;
const StyledButtonCancel = styled(ButtonForm)`
  opacity: 0.9;
  &:hover {
    opacity: 0.8;
  }
`;

const Main = styled.div`
  padding: 0 0 10px;
  margin: 0 0 30px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 20px 24px;
    margin: 0 0 50px;
  }
`;

const Select = styled.div`
  width: 20px;
  text-align: center;
  padding-right: 6px;
`;

const TextInput = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  padding: 3px;
  flex: 1;
  font-size: 0.85em;
  width: 200px;
  border-radius: 0.5em;
  &:focus {
    outline: none;
  }
`;

const StyledInput = styled.input`
  accent-color: ${({ theme }) => theme.global.colors.highlight};
`;

const OptionLabel = styled((p) => <Text as="label" {...p} />)`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;


export function EntityListDownload({
  typeId,
  config,
  fields,
  entities,
  taxonomies,
  connections,
  // frameworks,
  onClose,
  intl,
  isAdmin,
  searchQuery,
  entityIdsSelected,
}) {
  // console.log(config);
  // console.log(taxonomies.toJS());
  // console.log(fields);
  // console.log(entities.toJS());
  // console.log(connections.toJS());
  // console.log(frameworks);

  // TODO: fix framework selection
  const framework = 1;

  const [typeTitle, setTypeTitle] = useState('entities');
  const [csvFilename, setCSVFilename] = useState('csv');
  const [csvSuffix, setCSVSuffix] = useState(true);
  const [ignoreSearch, setIgnoreSearch] = useState(false);
  const [ignoreSelection, setIgnoreSelection] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [taxonomyColumns, setTaxonomies] = useState({});

  // for recommendations
  const [actiontypes, setActiontypes] = useState({});
  const [actionsAsRows, setActionsAsRows] = useState(false);
  let hasActions;


  const [indicatorsAsRows, setIndicatorsAsRows] = useState(false);
  const [indicatorsActive, setIndicatorsActive] = useState(false);
  // const [indicatorTypes, setIndicatorTypes] = useState({});
  let hasIndicators;

  // for actions
  const [recommendationTypes, setRecommendationTypes] = useState({});
  // const [recommendationsAsRows, setRecommendationsAsRows] = useState(false);
  const [includeRecommendations, setIncludeRecommendations] = useState(false);
  const [includeActions, setIncludeActions] = useState(false);
  const [includeTaxonomies, setIncludeTaxonomies] = useState(false);
  let hasRecommendations;

  // figure out export options
  const hasAttributes = !!config.attributes;
  const hasTaxonomies = !!config.taxonomies;

  if (config.serverPath === 'recommendations') {
    hasActions = connections.has('measures')
      && connections.get('measures').size > 0;

    hasIndicators = connections.has('indicators')
      && connections.get('indicators').size > 0;
  }
  if (config.serverPath === 'measures') {
    hasRecommendations = connections.has('recommendations')
      && connections.get('recommendations').toList().size > 0;

    hasIndicators = connections.has('indicators')
      && connections.get('indicators').size > 0;
  }
  /* if (config.serverPath === 'indicators') {

  } */
  // figure out options for each relationship type
  useEffect(() => {
    // set initial config values
    if (hasAttributes && fields) {
      setAttributes(
        getAttributes({
          typeId, // optional
          fieldAttributes: fields && fields.ATTRIBUTES,
          isAdmin,
          intl,
        })
      );
    }
    if (hasTaxonomies && taxonomies) {
      setTaxonomies(
        taxonomies.map((tax) => {
          const label = intl.formatMessage(appMessages.entities.taxonomies[tax.get('id')].plural);
          return ({
            id: tax.get('id'),
            label,
            active: false,
            column: snakeCase(label),
          });
        }).toJS()
      );
    }
    if (config.serverPath === 'measures') {
      /* if (hasRecommendations) {
         setRecommendationTypes(getDefaultEntityTypes(connections.get('recommendations').toList(), 'recommendation'));
       }
      if (hasIndicators) {
        setIndicatorTypes(connections.get('indicators').toList(), 'indicator');
      } */
    }
  }, [
    taxonomies,
    hasAttributes,
    hasIndicators,
    hasRecommendations,
    hasActions,
  ]);

  const totalCount = entities ? entities.size : 0;
  // check if should keep prefiltered search options
  const hasSearchQuery = !!searchQuery;
  const selectedCount = entityIdsSelected ? entityIdsSelected.size : 0;
  const hasSelectedEntities = entityIdsSelected && selectedCount > 0;
  // filter out list items according to keyword search or selection
  let searchedEntities = entities;
  if (hasSearchQuery && !ignoreSearch) {
    const searchAttributes = (
      config.views
      && config.views.list
      && config.views.list.search
    ) || ['title'];

    searchedEntities = filterEntitiesByKeywords(
      searchedEntities,
      searchQuery,
      searchAttributes,
    );
  }

  if (hasSelectedEntities && !ignoreSelection) {
    searchedEntities = searchedEntities.filter((entity) => entityIdsSelected.includes(entity.get('id')));
  }
  const count = searchedEntities.size;

  // set initial csv file name
  useEffect(() => {
    let title = 'unspecified';
    let tTitle = 'unspecified';
    if (config.serverPath === 'recommendations') {
      title = intl.formatMessage(appMessages.entities.recommendations.plural);
      tTitle = count !== 1 ? title : intl.formatMessage(appMessages.entities.recommendations.single);
    }
    if (config.serverPath === 'measures') {
      title = intl.formatMessage(appMessages.entities.measures.plural);
      tTitle = count !== 1 ? title : intl.formatMessage(appMessages.entities.measures.single);
    }
    if (config.serverPath === 'indicators') {
      title = intl.formatMessage(appMessages.entities.indicators.plural);
      tTitle = count !== 1 ? title : intl.formatMessage(appMessages.entities.indicators.single);
    }
    setTypeTitle(tTitle);
    setCSVFilename(snakeCase(title));
  }, [count]);

  const relationships = connections;
  // figure out columns
  let csvColumns = [{ id: 'id' }];
  if (hasAttributes && count > 0) {
    csvColumns = Object.keys(attributes).reduce((memo, attKey) => {
      if (attributes[attKey].active) {
        let displayName = attributes[attKey].column;
        if (!displayName || attributes[attKey].column === '') {
          displayName = attKey;
        }
        return [
          ...memo,
          { id: attKey, displayName },
        ];
      }
      return memo;
    }, csvColumns);
  }
  if (hasTaxonomies && count > 0) {
    csvColumns = Object.keys(taxonomyColumns).reduce((memo, taxId) => {
      if (taxonomyColumns[taxId].active) {
        let displayName = taxonomyColumns[taxId].column;
        if (!displayName || taxonomyColumns[taxId].column === '') {
          displayName = taxId;
        }
        return [
          ...memo,
          { id: `taxonomy_${taxId}`, displayName },
        ];
      }
      return memo;
    }, csvColumns);
  }
  let csvData;
  if (entities && count > 0) {
    if (config.serverPath === 'recommendations') {
      if (hasActions && includeActions) {
        csvColumns = [
          ...csvColumns,
          { id: 'connected_actions', displayName: 'connected_actions' },
          // { id: 'action_title', displayName: 'action_title' },
        ];
        /*  if (isAdmin) {
            csvColumns = [
              ...csvColumns,
              { id: 'action_draft', displayName: 'action_draft' },
              { id: 'action_private', displayName: 'action_private' },
            ];
          } */
      }
      if (hasIndicators && indicatorsActive) {
        csvColumns = [...csvColumns, ...getIndicatorColumns(indicatorsAsRows, connections, isAdmin)];
      }
      csvData = prepareDataForRecommendations({
        entities: searchedEntities,
        relationships,
        attributes,
        hasActions: hasActions && includeActions,
        hasTaxonomies,
        taxonomyColumns,
        taxonomies,
        hasIndicators: hasIndicators && indicatorsActive,
        indicatorsAsRows,
      });
    }
    if (config.serverPath === 'measures') {
      if (hasRecommendations && includeRecommendations) {
        csvColumns = [
          ...csvColumns,
          { id: 'connected_recommendations', displayName: 'connected_recommendations' },
        ];
      }
      if (hasIndicators && indicatorsActive) {
        csvColumns = [...csvColumns, ...getIndicatorColumns(indicatorsAsRows, connections, isAdmin)];
      }

      csvData = prepareDataForMeasures({
        entities: searchedEntities,
        relationships,
        attributes,
        hasRecommendations: hasRecommendations && includeRecommendations,
        recommendationTypes,
        hasIndicators: hasIndicators && indicatorsActive,
        indicatorsAsRows,
        hasTaxonomies: hasTaxonomies && includeTaxonomies,
        taxonomyColumns,
        taxonomies,
        framework,
      });
    }
    if (config.serverPath === 'indicators') {
      csvData = prepareDataForIndicators({
        entities: searchedEntities,
        relationships,
        attributes,
      });
    }
  }
  const csvDateSuffix = `_${getDateSuffix()}`;
  const size = React.useContext(ResponsiveContext);
  return (
    <Content inModal>
      <ContentHeader
        title={intl.formatMessage(messages.downloadCsvTitle)}
        type={CONTENT_MODAL}
        buttons={[{
          type: 'cancel',
          onClick: () => onClose(),
        }]}
      />
      <Main margin={{ bottom: 'large' }}>
        <Box margin={{ bottom: 'small' }}>
          <Text size="xxlarge" weight={700}>
            {count > 0 && (
              <FormattedMessage {...messages.exportAsTitle} values={{ typeTitle, count }} />
            )}
            {count === 0 && (
              <FormattedMessage {...messages.exportAsTitleNone} values={{ typeTitle }} />
            )}
          </Text>
        </Box>
        {(hasSearchQuery || hasSelectedEntities) && (
          <Box margin={{ bottom: 'large' }}>
            {hasSearchQuery && (
              <Box direction="row" align="center" fill={false}>
                <Box direction="row" align="center">
                  <Select>
                    <StyledInput
                      id="check-filter-keyword"
                      type="checkbox"
                      checked={ignoreSearch}
                      onChange={(evt) => setIgnoreSearch(evt.target.checked)}
                    />
                  </Select>
                </Box>
                <Text size="small" as="label" htmlFor="check-filter-keyword">
                  <FormattedMessage {...messages.ignoreKeyword} values={{ searchQuery }} />
                </Text>
              </Box>
            )}
            {hasSelectedEntities && (
              <Box direction="row" align="center" fill={false}>
                <Box direction="row" align="center">
                  <Select>
                    <StyledInput
                      id="check-filter-selection"
                      type="checkbox"
                      checked={ignoreSelection}
                      onChange={(evt) => setIgnoreSelection(evt.target.checked)}
                    />
                  </Select>
                </Box>
                <Text size="small" as="label" htmlFor="check-filter-selection">
                  <FormattedMessage {...messages.ignoreSelected} values={{ selectedCount, totalCount }} />
                </Text>
              </Box>
            )}
          </Box>
        )}
        {count > 0 && (
          <>
            <Box margin={{ bottom: 'large' }} gap="small">
              <Text>
                <FormattedMessage {...messages.exportDescription} />
              </Text>
            </Box>
            {config.serverPath === 'recommendations' && (
              <OptionsForRecommendations
                hasAttributes={hasAttributes}
                attributes={attributes}
                setAttributes={setAttributes}
                actiontypes={actiontypes}
                setActiontypes={setActiontypes}
                setIncludeActions={setIncludeActions}
                includeActions={includeActions}
                actionsAsRows={actionsAsRows}
                setActionsAsRows={setActionsAsRows}
                hasActions={hasActions}
                hasIndicators={hasIndicators}
                hasTaxonomies={hasTaxonomies}
                setTaxonomies={setTaxonomies}
                indicatorsActive={indicatorsActive}
                setIndicatorsActive={setIndicatorsActive}
                setIndicatorsAsRows={setIndicatorsAsRows}
                taxonomyColumns={taxonomyColumns}
                typeTitle={typeTitle}
              />
            )}
            {config.serverPath === 'measures' && (
              <OptionsForActions
                hasAttributes={hasAttributes}
                attributes={attributes}
                setAttributes={setAttributes}
                typeTitle={typeTitle}
                hasIndicators={hasIndicators}
                indicatorsActive={indicatorsActive}
                hasTaxonomies={hasTaxonomies}
                setTaxonomies={setTaxonomies}
                taxonomyColumns={taxonomyColumns}
                setIncludeTaxonomies={setIncludeTaxonomies}
                setIndicatorsActive={setIndicatorsActive}
                setIndicatorsAsRows={setIndicatorsAsRows}
                indicatorsAsRows={indicatorsAsRows}
                hasRecommendations={hasRecommendations}
                setRecommendationTypes={setRecommendationTypes}
                setIncludeRecommendations={setIncludeRecommendations}
                recommendationTypes={recommendationTypes}
              />
            )}
            {config.serverPath === 'indicators' && (
              <OptionsForIndicators
                hasAttributes={hasAttributes}
                attributes={attributes}
                setAttributes={setAttributes}
              />
            )}
            <Box
              gap="small"
              margin={{ top: 'xlarge' }}
            >
              <Box
                direction={(isMinSize(size, 'medium') || !csvSuffix) ? 'row' : 'column'}
                align={(isMinSize(size, 'medium') || !csvSuffix) ? 'center' : 'start'}
                gap="small"
                fill={false}
              >
                <OptionLabel htmlFor="input-filename">
                  <FormattedMessage {...messages.filenameLabel} />
                </OptionLabel>
                <Box
                  direction={(isMinSize(size, 'medium') || !csvSuffix) ? 'row' : 'column'}
                  align={(isMinSize(size, 'medium') || !csvSuffix) ? 'center' : 'start'}
                  gap={(isMinSize(size, 'medium') || !csvSuffix) ? 'none' : 'small'}
                >
                  <TextInput
                    minLength={1}
                    debounceTimeout={500}
                    value={csvFilename}
                    onChange={(evt) => setCSVFilename(evt.target.value)}
                    style={{ maxWidth: '250px', textAlign: isMinSize(size, 'medium') ? 'right' : 'left' }}
                  />
                  <Text size="xsmall">
                    {`${csvSuffix ? csvDateSuffix : ''}.csv`}
                  </Text>
                </Box>
              </Box>
              <Box direction="row" align="center" fill={false}>
                <Box direction="row" align="center">
                  <Select>
                    <StyledInput
                      id="check-timestamp"
                      type="checkbox"
                      checked={csvSuffix}
                      onChange={(evt) => setCSVSuffix(evt.target.checked)}
                    />
                  </Select>
                </Box>
                <Text size="small" as="label" htmlFor="check-timestamp">
                  <FormattedMessage {...messages.includeTimestamp} />
                </Text>
              </Box>
            </Box>
          </>
        )}
      </Main>
      {count > 0 && (
        <Footer>
          <Box direction="row" justify="end">
            <StyledButtonCancel type="button" onClick={() => onClose()}>
              <FormattedMessage {...appMessages.buttons.cancel} />
            </StyledButtonCancel>
            <CsvDownloader
              datas={csvData}
              columns={csvColumns}
              filename={`${csvFilename}${csvSuffix ? csvDateSuffix : ''}`}
              bom={false}
            >
              <ButtonSubmit
                type="button"
                onClick={(evt) => {
                  evt.preventDefault();
                  onClose();
                }}
              >
                <FormattedMessage {...messages.buttonDownload} />
              </ButtonSubmit>
            </CsvDownloader>
          </Box>
        </Footer>
      )}
    </Content>
  );
}

EntityListDownload.propTypes = {
  fields: PropTypes.object,
  config: PropTypes.object,
  typeNames: PropTypes.object,
  typeId: PropTypes.string,
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  onClose: PropTypes.func,
  isAdmin: PropTypes.bool,
  searchQuery: PropTypes.string,
  entityIdsSelected: PropTypes.object,
  intl: intlShape,
};

export default injectIntl(EntityListDownload);
