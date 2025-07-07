export const structure = (S) =>
    S.list()
        .title("Content")
        .items([
            S.listItem()
                .title("Seizoenen")
                .child(
                    S.documentTypeList("season")
                ),
            S.listItem()
                .title("Pagina's")
                .child(
                    S.documentTypeList("page")
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
                .title("Reminder mail")
                .child(
                    S.editor()
                        .schemaType("reminderEmail")
                        .documentId("reminderEmail")
                ),
            S.listItem()
                .title("Web copy")
                .child(
                    S.editor()
                        .schemaType("webCopy")
                        .documentId("webCopy")
                ),
            S.listItem()
                .title("Extra info bij reservatie")
                .child(
                    S.editor()
                        .schemaType("extraReservationInfo")
                        .documentId("extraReservationInfo")
                ),
        ]);