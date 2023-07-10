import sanityClient from "@sanity/client"
import imaegUrlBuilder from "@sanity/image-url"

const client = sanityClient({
    projectId: "1yijm38e",
    dataset: "production",
    useCdn: true,
    apiVersion: "2023-05-14",
});

const builder = imaegUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

export default client;