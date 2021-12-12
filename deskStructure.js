import S from "@sanity/desk-tool/structure-builder";

export default () =>
    S.list()
        .title("Content")
        .items([
            ...S.documentTypeListItems().filter(
                listItem =>
                    !["siteSettings", "confirmationEmail", "feedbackEmail", "webCopy", "ourFriends", "extraReservationInfo"].includes(listItem.getId())
            ),
            S.listItem()
                .title("Instellingen")
                .child(
                    S.editor()
                        .schemaType("siteSettings")
                        .documentId("siteSettings")
                ),
            S.listItem()
                .title("Bevestigingsmail")
                .child(
                    S.editor()
                        .schemaType("confirmationEmail")
                        .documentId("confirmationEmail")
                ),
            S.listItem()
                .title("Feedback mail")
                .child(
                    S.editor()
                        .schemaType("feedbackEmail")
                        .documentId("feedbackEmail")
                ),
            S.listItem()
                .title("Web copy")
                .child(
                    S.editor()
                        .schemaType("webCopy")
                        .documentId("webCopy")
                ),
            S.listItem()
                .title("Onze vrienden")
                .child(
                    S.editor()
                        .schemaType("ourFriends")
                        .documentId("ourFriends")
                ),
            S.listItem()
                .title("Extra info bij reservatie")
                .child(
                    S.editor()
                        .schemaType("extraReservationInfo")
                        .documentId("extraReservationInfo")
                ),
        ]);
