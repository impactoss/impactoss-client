export const hasNewError = (nextProps, props) => {
  const { viewDomain } = props;
  const { viewDomain: nextViewDomain } = nextProps;
  return (!nextViewDomain || !viewDomain) || (
    !nextViewDomain.getIn(['page', 'submitValid'])
    && !!viewDomain.getIn(['page', 'submitValid'])
  ) || (
    nextViewDomain.getIn(['page', 'saveError'])
    && !viewDomain.getIn(['page', 'saveError'])
  ) || (
    nextViewDomain.getIn(['page', 'deleteError'])
    && !viewDomain.getIn(['page', 'deleteError'])
  );
};
