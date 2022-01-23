import React from "react";
import TransactionalMail from "/TransactionalMail";

const TransactionalMailWrapper = (props) => {

    return (
        <ApolloClientProvider>
            {(apolloClient) => {
                console.log("render children with", apolloClient);
                return apolloClient ? (
                    <ApolloHooksProvider client={apolloClient}>
                        <div className={styles.TransactionalMail}>
                            <TransactionalMail />
                        </div>
                    </ApolloHooksProvider>
                ) : (
                    "loading"
                );
            }}
        </ApolloClientProvider>
    );
};

export default TransactionalMailWrapper;
