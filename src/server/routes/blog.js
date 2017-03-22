import Router from 'koa-router';
import directus from '../lib/directus';

const blogRouter = new Router()
  .get('/', async (ctx) => {
    const { data: blogPosts } = await directus.getItems('blog', {
      filters: { active: 1 },
      orderBy: 'id',
      orderDirection: 'DESC',
    });
    const { data: topics } = await directus.getItems('topics');
    const activeTopics = topics.filter((t) => {
      const activePosts = t.blog_posts.data.filter(p => p.active === 1);
      if (activePosts.length) {
        return true;
      }
      return false;
    });
    await ctx.render('blog', Object.assign(ctx.state, {
      layout: 'social',
      pageTitle: 'Blog | London School of Digital Marketing',
      blogPosts,
      activeTopics,
    }));
  })
  .get('/unpub', async (ctx) => {
    const { data: blogPosts } = await directus.getItems('blog', {
      filters: { active: 2 },
      orderBy: 'id',
      orderDirection: 'DESC',
    });
    const { data: topics } = await directus.getItems('topics');
    const activeTopics = topics.filter(t => t.blog_posts.meta.total > 0);
    await ctx.render('blog', Object.assign(ctx.state, {
      pageTitle: 'Blog | London School of Digital Marketing',
      blogPosts,
      activeTopics,
    }));
  })
  .get('/:topiclink', async (ctx) => {
    const { data: blogPosts } = await directus.getItems('blog', {
      filters: { active: 1 },
      orderBy: 'id',
      orderDirection: 'DESC',
    });
    const { data: topics } = await directus.getItems('topics');
    const activeTopics = topics.filter(t => t.blog_posts.meta.total > 0);
    const [currentTopic] = topics.filter(t => t.link === ctx.params.topiclink);
    const topicPosts = blogPosts.filter((p) => {
      const taggedPosts = p.topics.data.filter(t => t.id === currentTopic.id);
      if (taggedPosts.length) {
        return true;
      }
      return false;
    });
    await ctx.render('blog', Object.assign(ctx.state, {
      layout: 'social',
      pageTitle: 'Blog | London School of Digital Marketing',
      blogPosts: topicPosts,
      activeTopics,
      currentTopic,
    }));
  })
  .get('/:postid/:postslug', async (ctx) => {
    const { data: [{
      title,
      text,
      author: authorID,
      topics: {
        data: topics,
      },
      head_image: {
        data: {
          url: mainImage,
        },
      },
    }] } = await directus.getItems('blog', {
      filters: { id: ctx.params.postid },
    });
    const { data: [{
      first_name: firstName,
      last_name: lastName,
      facebook,
      avatar_file_id: {
        data: {
          thumbnail_url: avatar,
        },
      },
    }] } = await directus.getItems('directus_users', {
      filters: { id: authorID },
    });
    await ctx.render('blog-post', Object.assign(ctx.state, {
      layout: 'social',
      pageTitle: `${title} | London School of Digital Marketing`,
      title,
      topics,
      mainImage,
      text,
      author: {
        name: `${firstName} ${lastName}`,
        avatar,
        facebook,
      },
    }));
  });

export default blogRouter;
