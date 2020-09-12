import S from "@sanity/desk-tool/structure-builder";

export default () =>
    S.list()
        .title("Content")
        .items([
            ...S.documentTypeListItems().filter(
                listItem =>
                    !["siteSettings"].includes(listItem.getId())
            ),
            S.listItem()
                .title("Instellingen")
                .child(
                    S.editor()
                        .schemaType("siteSettings")
                        .documentId("siteSettings")
                ),
        ]);
