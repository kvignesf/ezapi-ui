/* export const Constants = {
  apiURL: "http://ezapi.ai",
  localURL: "https://instance-1.ezapi.ai/node",
  USER_DETAILS: "LOGGEDIN-USER-DETAILS",
  linkedinApiUrl: "https://www.linkedin.com/oauth/v2",
  linkedClientId: "77hqgq6vt20utk",
  linkedClientSecret: "kUQEH6uLaNAiEVbb",
  redirectUri: "https://instance-1.ezapi.ai/linkedin",
}; */

export const Constants = {
  apiURL: "http://ezapi.ai",
  localURL: process.env.REACT_APP_API_URL,
  USER_DETAILS: "LOGGEDIN-USER-DETAILS",
  linkedinApiUrl: "https://www.linkedin.com/oauth/v2",
  linkedClientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
  redirectUri: "/linkedin",
  linkedin_profile: "r_liteprofile",
  linkedin_state: "987654321",
};
