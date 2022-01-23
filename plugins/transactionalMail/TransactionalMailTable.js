import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";

// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "./TransactionalMail.css"

const TransactionalMailTable = ({ mailSentEvents }) => {
    return (
        <div className={styles.TransactionalMail}>
            <MaterialTable
                columns={[
                    { title: "Type", field: "type" },
                    { title: "Aan", field: "to" },
                    { title: "Tijdstip", field: "created" },
                    { title: "Status", field: "status" },
                    { title: "Tijdstip", field: "created" },
                ]}
                data={mailSentEvents}
                options={{ paging: true }}
            />
        </div>
    );
};

export default TransactionalMailTable;
