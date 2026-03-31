import jwtDecode from "jwt-decode"


export const setTokenTimestamp = (data) => {
    const refreshTokenTimeStamp = jwtDecode(data?.refresh_token).exp
    localStorage.setItem('refreshTokenTimeStamp', refreshTokenTimeStamp)
}

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};