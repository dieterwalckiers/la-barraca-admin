import React, { useCallback, useMemo } from "react";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import MaterialTable from "material-table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as request from "superagent";
import styles from "./Performance.css";

import MaterialTableIcons from "../../shared/MaterialTableIcons";

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
const Performance = (props) => {
  const { performance, onUpdateVisitors, production, expandedTimeIDs, toggleExpandedTimeID } = props;

  const { timeID, timeString, visitors } = performance;

  const handleUpdateVisitors = useCallback(
    async (visitors) => {
      await onUpdateVisitors({ performanceID: performance.id, timeID, production, visitors });
    },
    [onUpdateVisitors, performance]
  );

  const renderEditTable = useCallback(() => (
    <MaterialTable
      components={{
        Container: props => <div {...props} />
      }}
      columns={[
        { title: "Naam", field: "name" },
        { title: "Email", field: "email" },
        { title: "Telefoonnummer", field: "telephone" },
        {
          title: "Aantal standaard",
          field: "quantity",
          type: "numeric",
          lookup: {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            10: 10,
            11: 11,
            12: 12,
            13: 13,
            14: 14,
            15: 15,
            16: 16,
            17: 17,
            18: 18,
            19: 19,
            20: 20,
          },
          width: 100,
        },
        {
          title: "Aantal student",
          field: "studentQuantity",
          type: "numeric",
          lookup: {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            10: 10,
            11: 11,
            12: 12,
            13: 13,
            14: 14,
            15: 15,
            16: 16,
            17: 17,
            18: 18,
            19: 19,
            20: 20,
          },
          width: 100,
        },
        { title: "Opmerkingen", field: "remarks" },
      ]}
      data={visitors}
      editable={{
        onRowAdd: async (newData) => {
          console.log("newData", newData);
          try {
            await handleUpdateVisitors([...visitors, newData]);
            await handleSendConfirmationMail(newData, production.title, timeID, true);
          } catch (e) {
            console.error("error in adding", e.message || e);
          }
        },
        onRowUpdate: async (newData, oldData) => {
          const dataUpdate = [...visitors];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          await handleUpdateVisitors([...dataUpdate]);
          await handleSendConfirmationMail(newData, production.title, timeID);
        },
        onRowDelete: async (oldData) => {
          const dataDelete = [...visitors];
          const index = oldData.tableData.id;
          dataDelete.splice(index, 1);
          await handleUpdateVisitors([...dataDelete]);
        },
      }}
      title=""
      icons={MaterialTableIcons}
      options={{ paging: false }}
    />
  ), [visitors, production, timeID, MaterialTableIcons, timeString, handleUpdateVisitors, handleSendConfirmationMail]);

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
              ${visitors.map((v, i) => `
                <tr>
                  <td>${v.email}</td>
                  <td>${v.name}</td>
                  <td>${v.quantity ? `${v.quantity} standaard` : ""}${v.studentQuantity ? `<br/>${v.studentQuantity} student` : ""}</td>
                  <td>${v.telephone || ""}</td>
                  <td>${v.remarks || ""}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    w.window.print();
    w.window.close();
  }, [performance]);

  const totalReservationCount = useMemo(() => {
    return visitors.reduce((acc, v) => acc + parseInt((v.quantity || "0")) + parseInt((v.studentQuantity || "0")), 0);
  }, [visitors]);

  return (
    <Accordion key={`perfacc${timeID}`}
      expanded={expandedTimeIDs.includes(timeID)}
      onChange={() => toggleExpandedTimeID(timeID)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
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
        {renderEditTable()}
      </AccordionDetails>
    </Accordion>
  );
};

export default Performance;