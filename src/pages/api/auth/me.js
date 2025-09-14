import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";
import { requireAuth } from "@/lib/auth";

async function handleGet(req, res) {
  try {
    const authResult = await requireAuth(req, res);
    
    if (authResult.error) {
      return res
        .status(authResult.status)
        .json(apiResponse(false, null, authResult.error));
    }

    const user = authResult.user;
    
    // Check if jemaat user has profile data
    let isHasProfile = true;
    if (user.role === "JEMAAT" && !user.idJemaat) {
      isHasProfile = false;
    }

    // Return user data with profile status
    const userData = {
      ...user,
      isHasProfile
    };

    return res
      .status(200)
      .json(apiResponse(true, userData, "Data user berhasil diambil"));

  } catch (error) {
    console.error("Error getting user data:", error);
    return res
      .status(500)
      .json(apiResponse(false, null, "Terjadi kesalahan server", error.message));
  }
}

export default createApiHandler({
  GET: handleGet,
});