import React, { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import sharedStyles from "../shared/ProductionInfoPlugin.css?inline";
import ManualMailSender from "./ManualMailSender";

const ReactionsOverview = ({ production, reactions }) => {
    const productionTitle = useMemo(() => production?.title, [production]);
    
    const columns = [
        { field: "name", headerName: "Naam", width: 150 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "date", headerName: "Datum", width: 150 },
        { field: "score", headerName: "Score", width: 100, type: 'number' },
        { field: "internalReactionText", headerName: "Interne reactie", width: 250 },
        { field: "text", headerName: "Reactie op het stuk", width: 300 },
    ];

    const rows = useMemo(() => {
        return reactions?.map((reaction, index) => ({
            id: reaction.id || index,
            ...reaction
        })) || [];
    }, [reactions]);

    return (
        <div className={sharedStyles.document}>
            <ManualMailSender production={production} />
            <Box sx={{ height: 600, width: '100%', mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Reacties op {productionTitle}
                </Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[25, 50, 100]}
                    disableSelectionOnClick
                    autoHeight
                />
            </Box>
        </div>
    )
}

export default ReactionsOverview;