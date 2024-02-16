import {
  DELETE_MIN_ROLE,
  PAGE_ADMIN_MIN_ROLE,
  USER_ADMIN_MIN_ROLE,
  CONTRIBUTOR_MIN_ROLE,
  CONTRIBUTOR_MIN_ROLE_ASSIGNED,
  CONTRIBUTOR_MIN_ROLE_PUBLISH,
  SEE_DRAFT_MIN_ROLE,
  SEE_META_MIN_ROLE,
} from 'themes/config';

// higher is lower
export const canUserDeleteEntities = (highestRole) => highestRole <= DELETE_MIN_ROLE;
export const canUserManageUsers = (highestRole) => highestRole <= PAGE_ADMIN_MIN_ROLE;
export const canUserManagePages = (highestRole) => highestRole <= USER_ADMIN_MIN_ROLE;
export const canUserCreateOrEditReports = (highestRole) => highestRole <= CONTRIBUTOR_MIN_ROLE;
export const canUserPublishReports = (highestRole) => highestRole <= CONTRIBUTOR_MIN_ROLE_PUBLISH;
export const canUserBeAssignedToReports = (highestRole) => highestRole <= CONTRIBUTOR_MIN_ROLE_ASSIGNED;
export const canUserSeeDraftContent = (highestRole) => highestRole <= SEE_DRAFT_MIN_ROLE;
export const canUserSeeMeta = (highestRole) => highestRole <= SEE_META_MIN_ROLE;
