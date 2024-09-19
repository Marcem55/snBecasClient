import { jwtDecode } from "jwt-decode";

export const verifyUser = (verifyAdmin) => {
  const loggedUser = localStorage.getItem("loggedScholarshipAppUser");
  if (!loggedUser) {
    return false;
  }

  try {
    const parsedUser = JSON.parse(loggedUser);

    const decoded = jwtDecode(parsedUser.token);

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem("loggedScholarshipAppUser");

      return false;
    }

    if (verifyAdmin && decoded.role === "admin") return false;
    return true;
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
