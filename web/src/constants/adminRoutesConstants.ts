export const AdminRoutes = {
  IS_ADMIN_GUID_URL: process.env.NEXT_PUBLIC_API_URL + "/api/admin/isAdminGuid",
  CONFIRM_ADMIN_URL:
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/confirmAdminLogin",
  FETCH_ADMIN_BY_GUID: process.env.NEXT_PUBLIC_API_URL + "/api/admin/fetchAdminByGuid"
};
