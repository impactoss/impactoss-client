export const getHeaderColumns = (label, isManager, expandNo, expandableColumns, onExpand) => {
  // TODO figure out a betterway to determine column widths. this is terrible
  let width = 1;
  // if nested
  if (expandableColumns && expandableColumns.length > 0) {
    width = expandNo > 0 ? 0.5 : 0.66;
  }
  const columns = [{
    label,
    isManager,
    width,
  }];
  if (expandableColumns) {
    const exColumns = expandableColumns.map((col, i, exCols) => {
      const isExpand = expandNo > i;
      width = 1;
      // if nested
      if (exCols.length > i + 1) {
        // if nested && nestedExpanded
        if (expandNo > i + 1) {
          width = 0.5;
        // else if nested && !nestedExpanded
        } else if (isExpand) {
          width = 0.66;
        } else {
          width = 0.5;
        }
      // else if !nested // isExpand
      } else if (isExpand) {
        if (exCols.length > 1) {
          width = 0.5;
        }
      } else if (exCols.length > 1) {
        if (expandNo === i) {
          width = 0.34;
        } else {
          width = 0.5;
        }
      }

      return {
        label: col.label,
        expandableNo: expandableColumns,
        isExpand,
        onExpand: () => onExpand(isExpand ? i : i + 1),
        width,
      };
    });
    return columns.concat(exColumns);
  }
  return columns;
};
