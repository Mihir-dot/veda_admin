export async function hasAccess(permissionKey: string) {
  try {
    const permissionsStr = await localStorage.getItem("permissions");
    const permissions = JSON.parse(permissionsStr);

    const permission = Object.keys(permissions).map((category) => {
      return permissions[category][permissionKey];
    });

    return permission;
  } catch (error) {
    console.error("Error retrieving permissions from localStorage:", error);
    return [];
  }
}

export async function checkPermission(
  moduleName: string,
  permissionType: string
) {
  try {
    const permissionsStr = await localStorage.getItem("permissions");
    const permissions = JSON.parse(permissionsStr);

    if (
      permissions &&
      permissions[moduleName] &&
      permissions[moduleName][permissionType]
    ) {
      return true; // Permission exists
    } else {
      return false; // Permission does not exist
    }
  } catch (error) {
    console.error("Error retrieving permissions from localStorage:", error);
    return false;
  }
}
