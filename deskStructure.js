import S from "@sanity/desk-tool/structure-builder";

export default () =>
    S.list()
        .title("Content")
        .items([
            ...S.documentTypeListItems().filter(
                listItem =>
                    !["siteSettings", "confirmationEmail"].includes(listItem.getId())
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
        ]);
