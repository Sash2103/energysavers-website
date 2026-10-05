import Icon from './Icon';
import { fmtDate } from '@/lib/content';

// One post in a list (homepage news, blog page)
export default function PostLink({ post }) {
  return (
    <li className="post">
      <a href={`/${post.slug}/`}><time dateTime={post.date}>{fmtDate(post.date)}</time><span className="post__title">{post.title}</span><Icon name="arrow" /></a>
    </li>
  );
}
