import logger from "../lib/logger";
import util from "util";
import qs from "querystring";

import { PostAPI } from "../lib/axios";
import { GOOGLE_OAUTH_TOKEN_URL } from "../_data/urls";
import { getBodyForToken } from "../lib/utils";



export async function getAccessToken(refreshToken: string): Promise<string | undefined>  {
  const [error, response] = await PostAPI(GOOGLE_OAUTH_TOKEN_URL, qs.stringify(getBodyForToken(refreshToken)));

  if (error) {
      logger.error(`Error while getting access token: ${util.inspect(error, false, 3, true)}`);
      throw new Error("Couldn't get access token");
      
    }
    if (response?.data) {
        logger.debug(`Successfully got access token: ${util.inspect(response?.data, false, 3, true)}`);
        return response.data.access_token;
    }
}
