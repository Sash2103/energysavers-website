import Header from './Header';
import Footer from './Footer';
import Contact from './Contact';
import QuickActions from './QuickActions';
import Dialogs from '@/components/behaviour/Dialogs';
import Workplans from '@/components/behaviour/Workplans';

/**
 * Everything around a page's content: header, <main> (content, then the contact section), footer,
 * the floating call buttons, and any dialogs the page brings (extra).
 */
export default function Shell({ home = false, top = null, current = null, contact = true, extra = null, children }) {
  return (
    <>
      <Header home={home} top={top} current={current} />
      <main id="main">
        {children}
        {contact && <Contact />}
      </main>
      <Footer home={home} />
      <QuickActions />
      {extra}
      <Dialogs />
      <Workplans />
    </>
  );
}
