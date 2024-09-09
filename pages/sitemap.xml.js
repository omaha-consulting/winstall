import fetchWinstallAPI from "../utils/fetchWinstallAPI";

function generateSiteMap(urlPrefix, apps, packs, users) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${['apps', 'packs', 'eli5', 'privacy']
       .map((page) => {
         return `
       <url>
           <loc>${urlPrefix}/${page}</loc>
       </url>
     `;
       })
       .join('')}
     ${apps
       .map(({ _id, updatedAt }) => {
         return `
       <url>
           <loc>${urlPrefix}/apps/${escapeXml(_id)}</loc>
           <lastmod>${updatedAt}</lastmod>
       </url>
     `;
       })
       .join('')}
     ${packs
       .map(({ _id, updatedAt }) => {
         return `
       <url>
           <loc>${urlPrefix}/packs/${_id}</loc>
           <lastmod>${updatedAt}</lastmod>
       </url>
     `;
       })
       .join('')}
     ${users
       .map(( id ) => {
         return `
       <url>
           <loc>${urlPrefix}/users/${id}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

const escapeXml = (str) => {
  return str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return char;
    }
  });
};

function SiteMap() {
}

export async function getServerSideProps({ req, res }) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['host'];
  const urlPrefix = protocol + "://" + host;

  let { response: apps, err1 } = await fetchWinstallAPI(`/apps`, {}, true);
  if (err1) return { props: { err1 } };

  let { response: packs, err2 } = await fetchWinstallAPI(`/packs`, {}, true);
  if (err2) return { props: { err2 } };

  const users = Array.from(new Set(packs.map(pack => pack.creator)));
  users.forEach(pack => {console.log(pack);});

  const sitemap = generateSiteMap(urlPrefix, apps, packs, users);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;