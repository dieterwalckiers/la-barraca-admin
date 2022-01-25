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
import TransactionalMailTable from "./TransactionalMailTable";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import ApolloClientProvider from "../shared/ApolloClientProvider";

const TransactionalMail = () => {

    const [cursorBefore, setCursorBefore] = useState(undefined);
    const [cursorAfter, setCursorAfter] = useState(undefined);
    const [mailSentEvents, setMailSentEvents] = useState([]);

    const { data } = useQuery(gql`
        {
            allMailSentEvents(_size: 20) {
                data {
                    type
                    to
                    created
                    wasAccepted
                    wasRejected
                    response
                }
                before
                after
            }
        }
    `);

    const allMailSentEvents = data?.allMailSentEvents;
    useEffect(() => {
        if (allMailSentEvents?.data) {
            setMailSentEvents(allMailSentEvents.data);
        }
        if (allMailSentEvents?.before) {
            setCursorBefore(allMailSentEvents?.before);
        }
        if (allMailSentEvents?.after) {
            setCursorAfter(allMailSentEvents?.after);
        }
    }, [allMailSentEvents]);

    console.log(`cursorBefore ${cursorBefore}`)
    console.log(`cursorAfter ${cursorAfter}`)
    console.log(`mailSentEvents ${mailSentEvents}`)

    return (
        <div className={styles.TransactionalMail}>
            <TransactionalMailTable mailSentEvents={mailSentEvents} />
        </div>

    );
};

const TransactionalMailWrapper = (props) => {
    return (
        <ApolloClientProvider>
            <TransactionalMail {...props} />
        </ApolloClientProvider>
    );
};

export default TransactionalMailWrapper;
