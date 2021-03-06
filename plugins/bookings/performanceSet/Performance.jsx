import React, { forwardRef, useCallback } from "react";
import styles from "../Bookings.css";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import * as request from "superagent";

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

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};
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
        icons={tableIcons}
        options={{ paging: false }}
      />
    </div>
  );
};

export default Performance;
