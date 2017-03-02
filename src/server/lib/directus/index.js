import Client from 'directus-sdk-javascript';

const directusURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.npm_package_directus_prod;
  }
  return process.env.npm_package_directus_dev;
};

const directus = new Client(
  process.env.DI_KEY,
  directusURL(),
  1.1,
);

export async function loadBaseData() {
  try {
    const { data: pages } = await directus.getItems('pages', {
      columns: 'name,link',
    });
    return {
      nav: pages.filter(page => page.type === 'Main'),
      courses: pages.filter(page => page.type === 'Course'),
      pages,
    };
  } catch (err) {
    return new Error({ err });
  }
}

export default directus;
