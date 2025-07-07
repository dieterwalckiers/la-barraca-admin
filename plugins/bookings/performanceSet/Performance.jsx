import React, { useCallback, useMemo, useState } from "react";
import { 
  Accordion, 
  AccordionDetails, 
  AccordionSummary, 
  Button, 
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PrintIcon from '@mui/icons-material/Print';
import * as request from "superagent";
import styles from "./Performance.css?inline";

import getConfig from "../config";
const config = getConfig();
const { sendConfirmationMailEndpoint } = config;

async function handleSendConfirmationMail(info, productionTitle, timeID, sendConfirmation) {
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
      studentQuantity
    });
}

function EditToolbar({ setRows, setRowModesModel }) {
  const handleClick = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setRows((oldRows) => [...oldRows, { id, name: '', email: '', telephone: '', quantity: 0, studentQuantity: 0, remarks: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nieuwe reservatie
      </Button>
    </GridToolbarContainer>
  );
}

const Performance = (props) => {
  const { performance, onUpdateVisitors, production, expandedTimeIDs, toggleExpandedTimeID } = props;
  const { timeID, timeString, visitors } = performance;

  const [rows, setRows] = useState(() => 
    visitors?.map((visitor, index) => ({ 
      id: visitor.id || index, 
      ...visitor 
    })) || []
  );
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    handleUpdateVisitors(updatedRows);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const updatedRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
    setRows(updatedRows);
    
    try {
      await handleUpdateVisitors(updatedRows);
      if (newRow.isNew) {
        await handleSendConfirmationMail(newRow, production.title, timeID, true);
      } else {
        await handleSendConfirmationMail(newRow, production.title, timeID);
      }
    } catch (error) {
      console.error('Error updating visitors:', error);
    }
    
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleUpdateVisitors = useCallback(
    async (updatedVisitors) => {
      await onUpdateVisitors({ 
        performanceID: performance.id, 
        timeID, 
        production, 
        visitors: updatedVisitors 
      });
    },
    [onUpdateVisitors, performance, timeID, production]
  );

  // Create quantity options (0-20)
  const quantityOptions = Array.from({length: 21}, (_, i) => ({ value: i, label: i.toString() }));

  const columns = [
    { field: 'name', headerName: 'Naam', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'telephone', headerName: 'Telefoonnummer', width: 150, editable: true },
    {
      field: 'quantity',
      headerName: 'Aantal standaard',
      type: 'singleSelect',
      valueOptions: quantityOptions,
      width: 150,
      editable: true,
    },
    {
      field: 'studentQuantity',
      headerName: 'Aantal student',
      type: 'singleSelect', 
      valueOptions: quantityOptions,
      width: 150,
      editable: true,
    },
    { field: 'remarks', headerName: 'Opmerkingen', width: 200, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acties',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const handleClickPrint = useCallback(() => {
    const w = window.open();
    w.document.write(`
      <html>
        <head>
          <style>
            body {
              font-size: 11px;
            }
            td {
              padding: 3px;
              border-bottom: 1px solid lightgray;
            }
          </style>
        </head>
        <body>
          <h2>Reservaties ${production.title} op ${timeString}</h2>
          <table>
            <tr>
              <td><strong>Naam</strong></td>
              <td><strong>Email</strong></td>
              <td><strong>Telefoon</strong></td>
              <td><strong>Standaard</strong></td>
              <td><strong>Student</strong></td>
              <td><strong>Opmerkingen</strong></td>
            </tr>
            ${rows.map(visitor => `
              <tr>
                <td>${visitor.name || ''}</td>
                <td>${visitor.email || ''}</td>
                <td>${visitor.telephone || ''}</td>
                <td>${visitor.quantity || 0}</td>
                <td>${visitor.studentQuantity || 0}</td>
                <td>${visitor.remarks || ''}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `);
    w.print();
  }, [rows, production, timeString]);

  const totalVisitors = useMemo(() => {
    return rows.reduce((sum, visitor) => sum + (visitor.quantity || 0) + (visitor.studentQuantity || 0), 0);
  }, [rows]);

  return (
    <div className={styles.performance}>
      <Accordion 
        expanded={expandedTimeIDs.includes(timeID)} 
        onChange={() => toggleExpandedTimeID(timeID)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {timeString} - {totalVisitors} bezoekers
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ height: 600, width: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<PrintIcon />} 
                onClick={handleClickPrint}
                sx={{ mr: 2 }}
              >
                Print reservaties
              </Button>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: EditToolbar,
              }}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
              autoHeight
              disableRowSelectionOnClick
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Performance;