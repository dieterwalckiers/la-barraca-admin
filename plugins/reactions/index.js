import React from "react";
import { route } from "part:@sanity/base/router";
import Reactions from "./Reactions";
import ReactionsIcon from "./ReactionsIcon";

export default {
    title: "Reacties",
    name: "reactions",
    router: route("/:selectedProductionSheetId"),
    icon: ReactionsIcon,
    component: Reactions,
};
