// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

import season from "./season";
import production from "./production";
import crewEntry from "./crewEntry";
import siteSettings from "./siteSettings";
import confirmationEmail from "./confirmationEmail";
import webCopy from "./webCopy";
import ourFriends from "./ourFriends";
import extraReservationInfo from "./extraReservationInfo";
import partnerLogo from "./partnerLogo";
import feedbackEmail from "./feedbackEmail";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    season,
    siteSettings,
    production,
    crewEntry,
    confirmationEmail,
    feedbackEmail,
    webCopy,
    ourFriends,
    extraReservationInfo,
    partnerLogo,
  ])
});
