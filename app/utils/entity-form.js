export const hasNewError = (nextProps, props) =>
  (!nextProps.viewDomain.page.submitValid && !!props.viewDomain.page.submitValid)
  || (nextProps.viewDomain.page.saveError && !props.viewDomain.page.saveError)
  || (nextProps.viewDomain.page.deleteError && !props.viewDomain.page.deleteError);
