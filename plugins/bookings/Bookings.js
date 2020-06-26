import ApolloClient from "apollo-boost";
import React from "react";
import { StateLink, withRouterHOC, IntentLink } from "part:@sanity/base/router";
import Spinner from "part:@sanity/components/loading/spinner";
import Preview from "part:@sanity/base/preview";
import client from "part:@sanity/base/client";
import schema from "part:@sanity/base/schema";
import { gql } from "apollo-boost";
import PerformanceSet from "./performanceSet";

// Sanity uses CSS modules for styling. We import a stylesheet and get an
// object where the keys matches the class names defined in the CSS file and
// the values are a unique, generated class name. This allows you to write CSS
// with only your components in mind without any conflicting class names.
// See https://github.com/css-modules/css-modules for more info.
import styles from "./Bookings.css";

function initApolloClient() {
  return new ApolloClient({
    uri: "https://graphql.fauna.com/graphql",
    request: (operation) => {
      const b64encodedSecret = Buffer.from(
        "fnADsUC1yGACAMRG08nVKKK4_0oo4PzsyW-RIRKh" + ":" // weird but they // TODO: get from process.env.FAUNADB_SERVER_SECRET again (should already be set in the netlify ui)
      ).toString("base64");
      operation.setContext({
        headers: {
          Authorization: `Basic ${b64encodedSecret}`,
        },
      });
    },
  });
}

class Bookings extends React.Component {
  state = {};
  observables = {};
  apolloClient = undefined;

  handleReceiveSeasons = (seasons) => {
    console.log("receiving", seasons);

    const productions = seasons.reduce((reduced, season) => {
      return [
        ...reduced,
        ...season.productions.map((p) => ({ title: p.title, id: p._key })),
      ];
    }, []);

    console.log("extracted", productions);

    this.setState({ productions });
  };

  // handleReceiveDocument = (document) => {
  //   this.setState({ production });
  // };

  componentWillMount() {
    this.apolloClient = initApolloClient();
    this.observables.list = client.observable
      .fetch(
        '*[_type == "season"]{_id,"productions": productions[]{title, _key}}'
      )
      .subscribe(this.handleReceiveSeasons);
    // If we have a document ID as part of our route, load that document as well
    const productionId = this.props.router.state.selectedProductionId;
    if (productionId) {
      this.fetchAllPerformances(productionId);
    }
  }

  // fetchDocument(documentId) {
  //   // If we're already fetching a document, make sure to cancel that request
  //   if (this.observables.document) {
  //     this.observables.document.unsubscribe();
  //   }

  //   this.observables.document = client.observable
  //     .getDocument(documentId)
  //     .subscribe(this.handleReceiveDocument);
  // }

  /*
    @TODO Because there's no "get by productionID" implemented yet @ Fauna, we pull them all in for now. To fix!
  */
  async fetchAllPerformances(productionID) {
    const rs = await this.apolloClient.query({
      query: gql`
        {
          allPerformances {
            data {
              productionID
              timeID
              visitors
            }
          }
        }
      `,
    });
    if (rs.data) {
      const {
        allPerformances: { data: allPerformances },
      } = rs.data;
      this.setState({
        performances: allPerformances.filter(
          (p) => p.productionID === productionID
        ),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    // const current = this.props.router.state.selectedProductionId;
    // const next = nextProps.router.state.selectedProductionId;
    // if (current !== next) {
    //   this.fetchDocument(next);
    // }
  }

  // When unmounting, cancel any ongoing requests
  componentWillUnmount() {
    Object.keys(this.observables).forEach((obs) => {
      this.observables[obs].unsubscribe();
    });
  }

  renderProductions() {
    const { productions } = this.state;
    if (!productions) {
      return (
        <div className={styles.list}>
          <Spinner message="Loading..." center />}
        </div>
      );
    }

    return (
      <ul className={styles.list}>
        {productions.map((prod) => (
          <li key={prod.id} className={styles.listItem}>
            <StateLink state={{ selectedProductionId: prod.id }}>
              {prod.title}
            </StateLink>
          </li>
        ))}
      </ul>
    );
  }

  renderPerformances() {
    const { performances } = this.state;
    if (!performances) {
      return (
        <div className={styles.document}>
          <Spinner message="Reservaties worden geladen..." center />}
        </div>
      );
    }

    return <PerformanceSet performances={performances} />

    // const { _id, _type } = document;
    // return (
    //   <div className={styles.document}>
    //     <h2>
    //       {_id} -{" "}
    //       <IntentLink intent="edit" params={{ id: _id, type: _type }}>
    //         Edit
    //       </IntentLink>
    //     </h2>

    //     <pre>
    //       <code>{JSON.stringify(document, null, 2)}</code>
    //     </pre>
    //   </div>
    // );
  }

  render() {
    const { selectedProductionId } = this.props.router.state;

    return (
      <div className={styles.container}>
        {this.renderProductions()}
        {selectedProductionId && this.renderPerformances()}}
      </div>
    );
  }
}

export default withRouterHOC(Bookings);
