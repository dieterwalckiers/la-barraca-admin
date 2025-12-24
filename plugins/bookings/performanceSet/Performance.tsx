import React, { useCallback, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import * as request from "superagent";
import styles from "./Performance.module.css";

import getConfig from "../config";
const config = getConfig();
const { sendConfirmationMailEndpoint } = config;

interface Visitor {
  name: string;
  email: string;
  telephone?: string;
  quantity?: number;
  studentQuantity?: number;
  remarks?: string;
  tableData?: { id: number };
}

interface PerformanceData {
  id?: string;
  timeID: string;
  timeString: string;
  visitors: Visitor[];
  date: { isSameOrAfter: (d: unknown) => boolean };
}

interface PerformanceProps {
  performance: PerformanceData;
  onUpdateVisitors: (params: { performanceID?: string; timeID: string; production: { id: string; title: string }; visitors: number }) => Promise<void>;
  production: { id: string; title: string };
  expandedTimeIDs: string[];
  toggleExpandedTimeID: (timeID: string) => void;
}

async function handleSendConfirmationMail(
  info: Visitor,
  productionTitle: string,
  timeID: string,
  sendConfirmation?: boolean
) {
  const { name, email, quantity, studentQuantity } = info;
  if (sendConfirmation === undefined && !confirm(`Verstuur bevestigingsmail naar ${email} met deze nieuwe info?`)) {
    return;
  }
  await request
    .post(sendConfirmationMailEndpoint)
    .send({
      productionName: productionTitle,
      timeID,
      name,
      email,
      quantity,
      studentQuantity,
    });
}

const quantityOptions = Array.from({ length: 21 }, (_, i) => i);

const emptyVisitor: Visitor = {
  name: "",
  email: "",
  telephone: "",
  quantity: 0,
  studentQuantity: 0,
  remarks: "",
};

const Performance = (props: PerformanceProps) => {
  const { performance, onUpdateVisitors, production, expandedTimeIDs, toggleExpandedTimeID } = props;
  const { timeID, timeString, visitors } = performance;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdateVisitors = useCallback(
    async (newVisitors: Visitor[]) => {
      await onUpdateVisitors({ performanceID: performance.id, timeID, production, visitors: newVisitors as unknown as number });
    },
    [onUpdateVisitors, performance, timeID, production]
  );

  const handleOpenAdd = () => {
    setEditingVisitor({ ...emptyVisitor });
    setEditingIndex(null);
    setIsAdding(true);
    setEditDialogOpen(true);
  };

  const handleOpenEdit = (visitor: Visitor, index: number) => {
    setEditingVisitor({ ...visitor });
    setEditingIndex(index);
    setIsAdding(false);
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setEditingVisitor(null);
    setEditingIndex(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!editingVisitor) return;

    if (isAdding) {
      await handleUpdateVisitors([...visitors, editingVisitor]);
      await handleSendConfirmationMail(editingVisitor, production.title, timeID, true);
    } else if (editingIndex !== null) {
      const updated = [...visitors];
      updated[editingIndex] = editingVisitor;
      await handleUpdateVisitors(updated);
      await handleSendConfirmationMail(editingVisitor, production.title, timeID);
    }
    handleCloseDialog();
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Weet je zeker dat je deze reservatie wilt verwijderen?")) return;
    const updated = visitors.filter((_, i) => i !== index);
    await handleUpdateVisitors(updated);
  };

  const handleFieldChange = (field: keyof Visitor, value: string | number) => {
    if (!editingVisitor) return;
    setEditingVisitor({ ...editingVisitor, [field]: value });
  };

  const handleClickPrint = useCallback(() => {
    const w = window.open();
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <style>
            body { font-size: 11px; }
            td { padding: 3px; border-bottom: 1px solid lightgray; }
          </style>
        </head>
        <body>
          <h2>Reservaties ${production.title} op ${timeString}</h2>
          <table cellspacing="0" border="1">
            <thead>
              <tr>
                <th>e-mail</th>
                <th>naam</th>
                <th>aantal</th>
                <th>telefoonnummer</th>
                <th>opmerkingen</th>
              </tr>
            </thead>
            <tbody>
              ${visitors
                .map(
                  (v) => `
                <tr>
                  <td>${v.email}</td>
                  <td>${v.name}</td>
                  <td>${v.quantity ? `${v.quantity} standaard` : ""}${v.studentQuantity ? `<br/>${v.studentQuantity} student` : ""}</td>
                  <td>${v.telephone || ""}</td>
                  <td>${v.remarks || ""}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    w.print();
    w.close();
  }, [production, timeString, visitors]);

  const totalReservationCount = useMemo(() => {
    return visitors.reduce((acc, v) => acc + (v.quantity || 0) + (v.studentQuantity || 0), 0);
  }, [visitors]);

  return (
    <>
      <Accordion
        key={`perfacc${timeID}`}
        expanded={expandedTimeIDs.includes(timeID)}
        onChange={() => toggleExpandedTimeID(timeID)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={styles.performanceHeader}>
            <label className={styles.performanceHeaderTitle}>
              {`Voorstelling op ${timeString} (${totalReservationCount} reservaties)`}
            </label>
            <label className={styles.printBtn} onClick={handleClickPrint}>
              Afdrukken...
            </label>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} size="small">
              Toevoegen
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Naam</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Telefoonnummer</TableCell>
                  <TableCell>Aantal standaard</TableCell>
                  <TableCell>Aantal student</TableCell>
                  <TableCell>Opmerkingen</TableCell>
                  <TableCell>Acties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map((v, index) => (
                  <TableRow key={index}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.email}</TableCell>
                    <TableCell>{v.telephone || ""}</TableCell>
                    <TableCell>{v.quantity || 0}</TableCell>
                    <TableCell>{v.studentQuantity || 0}</TableCell>
                    <TableCell>{v.remarks || ""}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenEdit(v, index)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Dialog open={editDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isAdding ? "Nieuwe reservatie" : "Bewerk reservatie"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Naam"
              value={editingVisitor?.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              value={editingVisitor?.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              fullWidth
            />
            <TextField
              label="Telefoonnummer"
              value={editingVisitor?.telephone || ""}
              onChange={(e) => handleFieldChange("telephone", e.target.value)}
              fullWidth
            />
            <Select
              value={editingVisitor?.quantity || 0}
              onChange={(e) => handleFieldChange("quantity", e.target.value as number)}
              fullWidth
              displayEmpty
            >
              {quantityOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n} standaard
                </MenuItem>
              ))}
            </Select>
            <Select
              value={editingVisitor?.studentQuantity || 0}
              onChange={(e) => handleFieldChange("studentQuantity", e.target.value as number)}
              fullWidth
              displayEmpty
            >
              {quantityOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n} student
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Opmerkingen"
              value={editingVisitor?.remarks || ""}
              onChange={(e) => handleFieldChange("remarks", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuleren</Button>
          <Button onClick={handleSave} variant="contained">
            Opslaan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Performance;
