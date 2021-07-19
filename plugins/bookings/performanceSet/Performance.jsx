import React, { useCallback } from "react";
import MaterialTable from "material-table";
import * as request from "superagent";

import MaterialTableIcons from "../../shared/MaterialTableIcons";


import getConfig from "../config";
const config = getConfig();
const { sendConfirmationMailEndpoint } = config;

async function handleSendConfirmationMail(info, productionTitle, timeID) {
  const { name, email, quantity, studentQuantity } = info;
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
  const { performance, onUpdateVisitors, production } = props;
  const { timeID, timeString, visitors } = performance;

  const handleUpdateVisitors = useCallback(
    async (visitors) => {
      await onUpdateVisitors(performance.id, visitors);
    },
    [onUpdateVisitors, performance]
  );

  return (
    <div>
      <MaterialTable
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
              await handleSendConfirmationMail(newData, production.title, timeID);
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
        title={`Voorstelling op ${timeString}`}
        icons={MaterialTableIcons}
        options={{ paging: false }}
      />
    </div>
  );
};

export default Performance;
