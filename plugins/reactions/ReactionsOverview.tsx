import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import sharedStyles from "../shared/ProductionInfoPlugin.module.css";
import ManualMailSender from "./ManualMailSender";

interface Reaction {
  name?: string;
  email?: string;
  date?: string;
  score?: number;
  internalReactionText?: string;
  text?: string;
}

interface ReactionsOverviewProps {
  production?: { title: string };
  reactions: Reaction[];
}

const ReactionsOverview = ({ production, reactions }: ReactionsOverviewProps) => {
  const productionTitle = useMemo(() => production?.title, [production]);

  return (
    <div className={sharedStyles.document}>
      <ManualMailSender production={production} />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reacties op {productionTitle}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Naam</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Datum</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Interne reactie</TableCell>
              <TableCell>Reactie op het stuk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reactions.map((reaction, index) => (
              <TableRow key={index}>
                <TableCell>{reaction.name || ""}</TableCell>
                <TableCell>{reaction.email || ""}</TableCell>
                <TableCell>{reaction.date || ""}</TableCell>
                <TableCell>{reaction.score ?? ""}</TableCell>
                <TableCell>{reaction.internalReactionText || ""}</TableCell>
                <TableCell>{reaction.text || ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ReactionsOverview;
