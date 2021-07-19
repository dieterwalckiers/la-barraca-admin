import React, { useMemo } from "react";
import MaterialTable from "material-table";
import MaterialTableIcons from "../shared/MaterialTableIcons";
import sharedStyles from "../shared/ProductionInfoPlugin.css";
import ManualMailSender from "./ManualMailSender";

const ReactionsOverview = ({ production, reactions }) => {
    const productionTitle = useMemo(() => production?.title, [production]);
    return (
        <div className={sharedStyles.document}>
            <ManualMailSender production={production} />
            <MaterialTable
                columns={[
                    { title: "Naam", field: "name", width: 100 },
                    { title: "Email", field: "email", width: 100 },
                    { title: "Datum", field: "date", width: 100 },
                    {
                        title: "Score", field: "score",
                        width: 10,
                    },
                    { title: "Interne reactie", field: "internalReactionText", width: 200 },
                    { title: "Reactie op het stuk", field: "text", width: 200 },
                ]}
                data={reactions}
                title={`Reacties op ${productionTitle}`}
                icons={MaterialTableIcons}
                options={{ paging: false }}
            />
        </div>
    )
}

export default ReactionsOverview;