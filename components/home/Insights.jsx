import Icon from '@/components/shared/Icon';
import PostLink from '@/components/shared/PostLink';
import { loadPosts } from '@/lib/content';

// The news intro is also the Blog page's lede
export const INSIGHTS_INTRO = 'Wait for our latest news related to our products, descriptions and the quality we keep in every deal we make.';

// The three latest posts
export default function Insights() {
  return (
    <section className="insights" id="insights" aria-labelledby="insights-title">
      <div className="wrap insights__grid">
        <div className="insights__head">
          <h2 className="section-title" id="insights-title">Our latest <span className="accent">news</span></h2>
          <p>{INSIGHTS_INTRO}</p>
        </div>
        <ul className="posts">
          {loadPosts().slice(0, 3).map(p => <PostLink post={p} key={p.slug} />)}
        </ul>
        <a className="text-link insights__all" href="/blog/">Blog <Icon name="arrow" /></a>
      </div>
    </section>
  );
}
